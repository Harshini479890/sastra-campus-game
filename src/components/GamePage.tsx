import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { Book, User, Map, Bell, LogOut, MessageSquare, Calendar, Trophy, Users, BookOpen } from 'lucide-react';
import ProfilePanel from './ProfilePanel';
import MaterialsPanel from './MaterialsPanel';
import MapPanel from './MapPanel';
import NotificationsPanel from './NotificationsPanel';
import ChatbotPanel from './ChatbotPanel';
import type { User as UserType } from '../App';

// Define the Notification type for use within this component
export interface Notification {
    id: number;
    type: 'event' | 'club' | 'achievement' | 'material';
    title: string;
    description: string;
    time: string;
    club: string;
    icon: React.ElementType; // Icon component from lucide-react (e.g., Trophy, Calendar)
    color: string; // Tailwind gradient class (e.g., 'from-yellow-100 to-orange-100')
    iconColor: string; // Tailwind text color class (e.g., 'text-yellow-600')
}

interface GamePageProps {
    user: UserType;
    onLogout: () => void;
}

type ActivePanel = 'profile' | 'materials' | 'map' | 'notifications' | 'chatbot' | null;

// Initial set of mock notifications
const initialNotifications: Notification[] = [
    {
        id: 1,
        type: 'event',
        title: 'Annual Coding Competition Tomorrow!',
        description: 'Join the competitive coding event at 10 AM in the Computer Lab (Room 301).',
        time: '2 hours ago',
        club: 'Coding Club',
        icon: Trophy,
        color: 'from-yellow-100 to-orange-100',
        iconColor: 'text-yellow-600'
    },
    {
        id: 2,
        type: 'club',
        title: 'Photography Workshop Signup',
        description: 'Learn advanced photography techniques this weekend. Limited seats available!',
        time: '1 day ago',
        club: 'Photography Club',
        icon: Users,
        color: 'from-purple-100 to-pink-100',
        iconColor: 'text-purple-600'
    },
    {
        id: 3,
        type: 'achievement',
        title: 'New Badge Earned!',
        description: 'You earned the "Quick Learner" badge for completing 5 quizzes successfully.',
        time: '2 days ago',
        club: 'System',
        icon: Trophy,
        color: 'from-green-100 to-blue-100',
        iconColor: 'text-green-600'
    },
    {
        id: 4,
        type: 'material',
        title: 'New Study Material Available',
        description: 'Advanced Mathematics notes uploaded by Prof. Kumar for Calculus II.',
        time: '3 days ago',
        club: 'Mathematics Dept.',
        icon: BookOpen,
        color: 'from-blue-100 to-indigo-100',
        iconColor: 'text-blue-600'
    },
    {
        id: 5,
        type: 'event',
        title: 'Career Fair Registration Open',
        description: 'Don\'t miss the chance to meet top employers. Register by Friday!',
        time: '4 days ago',
        club: 'Career Services',
        icon: Calendar,
        color: 'from-red-100 to-orange-100',
        iconColor: 'text-red-600'
    }
];

const GamePage: React.FC<GamePageProps> = ({ user, onLogout }) => {
    const phaserRef = useRef<HTMLDivElement>(null);
    const [activePanel, setActivePanel] = useState<ActivePanel>(null);
    const isPanelOpenRef = useRef(false);
    const [playerChoices, setPlayerChoices] = useState<{ question: string; choice: string }[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

    const unreadNotificationCount = notifications.length;
    
    // --- Pause/Unpause Game Loop Hook ---
    useEffect(() => {
        isPanelOpenRef.current = activePanel !== null;
    }, [activePanel]);

    /**
     * Handler function for Club Representatives to post an event.
     */
    const handlePostEvent = (title: string, description: string) => {
        const newId = Date.now();
        const newEventNotification: Notification = {
            id: newId,
            type: 'event',
            title: title,
            description: description,
            time: 'Just now',
            club: user.clubName || 'Unknown Club',
            icon: Calendar,
            color: 'from-green-100 to-blue-100',
            iconColor: 'text-green-600',
        };
        setNotifications(prev => [newEventNotification, ...prev]);
        setActivePanel('notifications'); 
    };

    /**
     * Handler to navigate directly to the materials/upload panel.
     */
    const handleNavigateToUpload = () => {
        setActivePanel('materials');
    };

    const togglePanel = (panel: ActivePanel) => {
        setActivePanel(activePanel === panel ? null : panel);
    };

    // --- Phaser Game Setup (Run ONCE) ---
    // The dependency array is EMPTY to prevent reloading the game instance.
    useEffect(() => {
        if (!phaserRef.current) return;

        // --- Phaser Scene Definition ---
        // NOTE: The showScenarioDialog function passed as a callback via `scene`
        // MUST be defined OUTSIDE of the useEffect, but since it relies on setPlayerChoices,
        // we use a mutable ref for the setter function to access the current state.
        const setChoicesRef = { current: setPlayerChoices };

        // Define the core Phaser functions *inside* the useEffect to use Phaser's context
        function preload(this: Phaser.Scene) {
            const campus = ['TDC','SASHE','SOC','LTC','KRC','PV','Kamadhenu','Vashishta','SPS','KC','SouthernCanopy'];
            campus.forEach(name => this.load.image(name, `assets/${name}.png`));

            for (let i = 0; i < 8; i++) this.load.image(`idle${i}`, `assets/Character1F_1_idle_${i}.png`);
            for (let i = 0; i < 8; i++) this.load.image(`walk${i}`, `assets/Character1F_1_walk_${i}.png`);
            for (let i = 0; i < 6; i++) this.load.image(`npc_talk${i}`, `assets/Character3F_3_idle_${i}.png`);
        }

        function create(this: Phaser.Scene) {
            const scene = this as any;
            scene.setChoicesRef = setChoicesRef; // Attach ref to scene
            scene.isPanelOpenRef = isPanelOpenRef; // Attach ref to scene

            // --- Buildings ---
            const buildings = [
                { name: "SPS Hostel", x: 100, y: 100, color: 0x4caf50 },
                { name: "Kamadhenu Hostel", x: 250, y: 300, color: 0x81c784 },
                { name: "Vashishta Hostel", x: 100, y: 300, color: 0xa5d6a7 },
                { name: "PV Hostel", x: 250, y: 450, color: 0x66bb6a },
                { name: "VKJ", x: 500, y: 50, color: 0xffb74d },
                { name: "KC Canteen", x: 750, y: 50, color: 0xffb74d },
                { name: "Southern Canopy", x: 800, y: 600, color: 0xffcc80 },
                { name: "TDC", x: 450, y: 350, color: 0x90caf9 },
                { name: "Library(KRC)", x: 600, y: 350, color: 0x42a5f5 },
                { name: "SOC", x: 600, y: 200, color: 0x64b5f6 },
                { name: "LTC", x: 600, y: 500, color: 0x64b5f6 },
                { name: "SASHE", x: 450, y: 200, color: 0xba68c8 },
            ];
            buildings.forEach(b => drawBuilding(scene, b.x, b.y, b.name, b.color));
            drawGrid(scene, 100);
            drawRoad(scene, 175, 300, 175, 600);
            drawRoad(scene, 175, 600, 725, 600);
            drawRoad(scene, 315, 250, 700, 250);
            drawRoad(scene, 700, 135, 700, 600);
            drawRoad(scene, 180, 125, 1300, 125, 30);

            // --- Player (Initial position is set here) ---
            scene.player = scene.add.sprite(180, 500, 'idle0').setScale(1.3);
            scene.anims.create({ key: 'idle', frames: Array.from({ length: 8 }, (_, i) => ({ key: `idle${i}` })), frameRate: 2, repeat: -1 });
            scene.anims.create({ key: 'walk', frames: Array.from({ length: 8 }, (_, i) => ({ key: `walk${i}` })), frameRate: 6, repeat: -1 });
            scene.player.play('idle');

            scene.cursors = scene.input.keyboard.createCursorKeys();
            scene.WASD = {
                up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            };

            // --- Scenarios (NPCs) ---
            const scenarios = [
                { name: "Cultural Club", x: 620, y: 220, message: "Cultural Club: Help for the fest! How will you participate?", options: ["A: Props/costumes", "B: Games/activities", "C: Tech/setup", "D: Not interested"], completed: false },
                { name: "Sports Club", x: 700, y: 400, message: "Sports Club: Football/badminton tournament! Join?", options: ["A: Support creatively", "B: Play games", "C: Manage scores", "D: Not interested"], completed: false },
                { name: "Photography Club", x: 400, y: 350, message: "Photography Club: How should we cover college life?", options: ["A: Artsy/cultural shots", "B: Sports/action shots", "C: Tech/workshop coverage", "D: Not interested"], completed: false },
                { name: "Tech Club", x: 500, y: 500, message: "Tech Club: Building a robot. Where can you contribute?", options: ["A: Creative design/story", "B: Test performance", "C: Coding/electronics", "D: Not interested"], completed: false },
                { name: "College Week", x: 750, y: 300, message: "College Week: What will you join?", options: ["A: Art/music/drama", "B: Sports/fitness", "C: Hackathon/science", "D: Not interested"], completed: false },
            ];

            scene.scenarioGroups = scenarios;
            scene.dialogContainer = null;

            // NPC Sprites
            scenarios.forEach((sc, i) => {
                const npc = scene.add.sprite(sc.x, sc.y, 'npc_talk0').setScale(1.3);
                scene.anims.create({ key: `npc_idle_${i}`, frames: Array.from({ length: 6 }, (_, f) => ({ key: `npc_talk${f}` })), frameRate: 2, repeat: -1 });
                npc.play(`npc_idle_${i}`);
                sc.npcSprite = npc;
            });
        }

        function update(this: Phaser.Scene, time: number, delta: number) {
            const scene = this as any;
            if (scene.isPanelOpenRef.current) { // Use the attached ref
                scene.player.play('idle', true);
                return;
            }

            const speed = 200 * (delta / 1000);
            let dx = 0, dy = 0, moving = false;
            if (scene.cursors.left.isDown || scene.WASD.left.isDown) { dx -= speed; scene.player.setFlipX(true); moving = true; }
            if (scene.cursors.right.isDown || scene.WASD.right.isDown) { dx += speed; scene.player.setFlipX(false); moving = true; }
            if (scene.cursors.up.isDown || scene.WASD.up.isDown) { dy -= speed; moving = true; }
            if (scene.cursors.down.isDown || scene.WASD.down.isDown) { dy += speed; moving = true; }

            scene.player.x += dx;
            scene.player.y += dy;
            if (moving) scene.player.play('walk', true); else scene.player.play('idle', true);

            // --- Scenario proximity ---
            scene.scenarioGroups.forEach((sc: any) => {
                if (sc.completed) return;
                const dist = Phaser.Math.Distance.Between(scene.player.x, scene.player.y, sc.x, sc.y);
                if (dist < 90) showScenarioDialog(scene, sc);
            });
        }

        // --- Phaser Config ---
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: '100%',
            height: '100%',
            backgroundColor: '#d4f1f9',
            parent: phaserRef.current,
            scene: { preload, create, update },
        };

        const game = new Phaser.Game(config);
        const handleResize = () => {
            const parent = phaserRef.current;
            if (parent) game.scale.resize(parent.clientWidth, parent.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            game.destroy(true);
            window.removeEventListener('resize', handleResize);
        };
    }, []); // EMPTY dependency array: FIXES GAME RELOAD ISSUE

    // --- showScenarioDialog definition (Phaser context) ---
    // Moved outside the useEffect that initializes the game, but needs to be accessible.
    // We attach it to the Phaser scene using a reference inside the create function.
    function showScenarioDialog(scene: any, scenario: any) {
        if (scene.dialogContainer) return;

        const container = scene.add.container(150, 400);
        const bg = scene.add.rectangle(0, 0, 800, 180, 0x000000).setOrigin(0, 0).setStrokeStyle(4, 0x8B4513);
        container.add(bg);

        const questionText = scene.add.text(20, 20, scenario.message, {
            fontSize: '20px', color: '#ffffff', wordWrap: { width: 760 },
        });
        container.add(questionText);

        scenario.options.forEach((opt: string, idx: number) => {
            const x = 40 + (idx % 2) * 380;
            const y = 80 + Math.floor(idx / 2) * 45;

            const rect = scene.add.rectangle(x, y, 350, 40, 0x111111).setOrigin(0, 0).setStrokeStyle(2, 0x8B4513);
            const text = scene.add.text(x + 175, y + 20, opt, { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);

            rect.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
                // Use the ref to call the current setPlayerChoices function from React state
                scene.setChoicesRef.current(prevChoices => {
                    const newChoices = [...prevChoices, { question: scenario.message, choice: opt }];
                    return newChoices;
                });
                scenario.completed = true;
                container.destroy();
                scene.dialogContainer = null;
            });

            container.add(rect);
            container.add(text);
        });

        scene.dialogContainer = container;
    }


    // --- React UI/Panel Rendering ---
    const mainContainerClass = `min-h-screen w-screen relative ${activePanel ? 'overflow-hidden' : 'overflow-auto'}`;

    return (
        <div className={mainContainerClass}>
            <div ref={phaserRef} className="absolute inset-0" />

            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-30 p-4 flex justify-between items-center w-full">
                <div className="pixel-card bg-white bg-opacity-90 px-4 py-2 rounded-xl">
                    <h2 className="text-xl font-bold text-gray-800 pixel-text">SASTRA Campus Quest</h2>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="pixel-card bg-white bg-opacity-90 px-3 py-2 rounded-xl">
                        <span className="text-sm font-medium text-gray-700">
                            {user.type === 'student' ? `${user.points} pts` : user.clubName}
                        </span>
                    </div>
                    <button onClick={onLogout} className="pixel-button bg-red-500 hover:bg-red-600 text-white p-3 rounded-full">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            {/* Game UI Buttons */}
            <div className="absolute top-20 right-4 z-30 space-y-3">
                <button onClick={() => togglePanel('chatbot')} className={`pixel-button p-4 rounded-full ${activePanel === 'chatbot' ? 'bg-blue-600 text-white animate-bounce-subtle' : 'bg-white bg-opacity-90 text-gray-700 hover:bg-opacity-100'}`}><MessageSquare size={24} /></button>
                <button onClick={() => togglePanel('materials')} className={`pixel-button p-4 rounded-full ${activePanel === 'materials' ? 'bg-green-600 text-white' : 'bg-white bg-opacity-90 text-gray-700 hover:bg-opacity-100'}`}><Book size={24} /></button>
                <button onClick={() => togglePanel('profile')} className={`pixel-button p-4 rounded-full ${activePanel === 'profile' ? 'bg-green-600 text-white' : 'bg-white bg-opacity-90 text-gray-700 hover:bg-opacity-100'}`}><User size={24} /></button>
                <button onClick={() => togglePanel('map')} className={`pixel-button p-4 rounded-full ${activePanel === 'map' ? 'bg-green-600 text-white' : 'bg-white bg-opacity-90 text-gray-700 hover:bg-opacity-100'}`}><Map size={24} /></button>
                <button onClick={() => togglePanel('notifications')} className={`pixel-button p-4 rounded-full ${activePanel === 'notifications' ? 'bg-green-600 text-white' : 'bg-white bg-opacity-90 text-gray-700 hover:bg-opacity-100'}`}>
                    <Bell size={24} />
                    {/* FIXED: Use actual state count */}
                    {unreadNotificationCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                        </div>
                    )}
                </button>
            </div>

            {/* Panels */}
            {activePanel === 'chatbot' && <ChatbotPanel user={user} onClose={() => setActivePanel(null)} />}
            {activePanel === 'profile' && (
                <ProfilePanel 
                    user={user} 
                    onClose={() => setActivePanel(null)} 
                    onNavigateToUpload={handleNavigateToUpload} 
                    playerChoices={playerChoices} 
                    onPostEvent={handlePostEvent}
                />
            )}
            {activePanel === 'materials' && <MaterialsPanel onClose={() => setActivePanel(null)} />}
            {activePanel === 'map' && <MapPanel onClose={() => setActivePanel(null)} />}
            {activePanel === 'notifications' && (
                <NotificationsPanel 
                    user={user} 
                    onClose={() => setActivePanel(null)} 
                    notifications={notifications} 
                    setNotifications={setNotifications} 
                />
            )}
        </div>
    );
};

export default GamePage;

// --- Helper Functions (Phaser Utilities) ---
function drawBuilding(scene: Phaser.Scene, x: number, y: number, name: string, color: number) {
    const width = 120, height = 80;
    scene.add.rectangle(x, y, width, height, color).setStrokeStyle(4, 0x000000);
    scene.add.text(x, y, name, { fontSize: '16px', color: '#000', backgroundColor: '#ffffffcc', padding: { x: 4, y: 2 } }).setOrigin(0.5);
}

function drawRoad(scene: Phaser.Scene, x1: number, y1: number, x2: number, y2: number, width = 20, color = 0x555555) {
    const dx = x2 - x1, dy = y2 - y1, length = Math.sqrt(dx * dx + dy * dy);
    const road = scene.add.rectangle((x1 + x2) / 2, (y1 + y2) / 2, length, width, color);
    road.setRotation(Math.atan2(dy, dx));
    return road;
}

function drawGrid(scene: Phaser.Scene, step = 100) {
    const width = scene.scale.width, height = scene.scale.height;
    for (let x = 0; x <= width; x += step) scene.add.line(0, 0, x, 0, x, height, 0xcccccc, 0.5).setOrigin(0);
    for (let y = 0; y <= height; y += step) scene.add.line(0, 0, 0, y, width, y, 0xcccccc, 0.5).setOrigin(0);
}