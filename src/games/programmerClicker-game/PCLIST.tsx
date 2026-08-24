import Decimal from "break_infinity.js";

export interface buyables {
    name: string;
    price: Decimal;
    description: string;
    icon: string;
}

export interface items extends buyables {
    amount: Decimal;
    locPerSec: Decimal;
}

export interface upgrades extends buyables {
    bought: boolean;
}

interface consumables extends buyables {
    duration: number;
    active: boolean;
    startTime: number;
}

const CONSUMABLELIST: consumables[] = [
    { startTime: 0, active: false, name: "Coffee", price: new Decimal(2500), description: "Doubles manual click power.", icon: "", duration: 30 },
    { startTime: 0, active: false, name: "Energy Drink", price: new Decimal(3000), description: "Doubles passive LoC production.", icon: "", duration: 30 },
    { startTime: 0, active: false, name: "Debugging Session", price: new Decimal(2700), description: "Triples manual click power.", icon: "", duration: 15 },
    { startTime: 0, active: false, name: "Productivity Suite", price: new Decimal(3500), description: "Increases all LoC production by 50%.", icon: "", duration: 30 },
    { startTime: 0, active: false, name: "Code Optimization", price: new Decimal(3200), description: "Doubles passive LoC production and item production.", icon: "", duration: 20 },
    { startTime: 0, active: false, name: "Overclock", price: new Decimal(4000), description: "Quadruples all LoC production.", icon: "", duration: 10 }
];

const ITEMLIST: items[] = [
    { name: "Proper Mouse", price: new Decimal(15), description: "Clicks once every 10 seconds.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(1) },
    { name: "Gaming Mouse", price: new Decimal(250), description: "RGB adds at least 20% productivity.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(15) },
    { name: "Mouse Pad", price: new Decimal(4500), description: "Smoother gliding, smoother coding.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(250) },
    { name: "Mechanical Keyboard", price: new Decimal(85000), description: "The clicks alone make you feel faster.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(4200) },
    { name: "Premium Keycaps", price: new Decimal(1800000), description: "Typing has never sounded this satisfying.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(85000) },
    { name: "Ergonomic Chair", price: new Decimal(40000000), description: "Your spine approves.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(1800000) },
    { name: "1080p Monitor", price: new Decimal(950000000), description: "Pixels become slightly less visible.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(40000000) },
    { name: "Second Monitor", price: new Decimal(24000000000), description: "One for code, one for Stack Overflow.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(950000000) },
    { name: "16GB DDR5 RAM", price: new Decimal(650000000000), description: "Chrome now crashes slightly less often.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(24000000000) },
    { name: "Better CPU", price: new Decimal(18000000000000), description: "Compilation no longer feels eternal.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(620000000000) },
    { name: "27-inch Monitor", price: new Decimal(520000000000000), description: "You can finally fit two files side-by-side.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(17000000000000) },
    { name: "32GB DDR5 RAM", price: new Decimal(15000000000000000), description: "Enough tabs? Never.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(480000000000000) },
    { name: "Flagship CPU", price: new Decimal(450000000000000000), description: "Your fans become your roommates.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(13500000000000000) },
    { name: "Ultrawide Monitor", price: new Decimal(14000000000000000000), description: "Horizontal scrolling is now optional.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(390000000000000000) },
    { name: "64GB DDR5 RAM", price: new Decimal(450000000000000000000), description: "Why stop at 32?", icon: "", amount: new Decimal(0), locPerSec: new Decimal(11500000000000000000) },
    { name: "RTX GPU", price: new Decimal(15000000000000000000000), description: "Mostly for coding. Definitely.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(350000000000000000000) },
    { name: "Standing Desk", price: new Decimal(520000000000000000000000), description: "Coding while standing somehow feels more serious.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(11000000000000000000000) },
    { name: "Triple Monitor Setup", price: new Decimal(19000000000000000000000000), description: "You now lose your mouse on three screens.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(360000000000000000000000) },
    { name: "128GB DDR5 RAM", price: new Decimal(720000000000000000000000000), description: "The definition of 'just in case.'", icon: "", amount: new Decimal(0), locPerSec: new Decimal(12500000000000000000000000) },
    { name: "Developer Workstation", price: new Decimal(28000000000000000000000000000), description: "Your dream setup has finally arrived.", icon: "", amount: new Decimal(0), locPerSec: new Decimal(450000000000000000000000000) }
];

const UPGRADELIST: upgrades[] = [
    { name: "Mechanical Fingers", price: new Decimal(5000), description: "Increases your clicking power as you buy more.", icon: "", bought: false },
    { name: "Auto Formatter", price: new Decimal(50000), description: "All items produce 200% more LoC.", icon: "", bought: false },
    { name: "Stack Overflow Premium", price: new Decimal(500000), description: "Click power increases 5x more.", icon: "", bought: false },
    { name: "Dual IDE Workflow", price: new Decimal(50000000), description: "Passive LoC production increases by 100%.", icon: "", bought: false },
    { name: "AI Pair Programmer", price: new Decimal(50000000000), description: "triples passive LoC generation.", icon: "", bought: false },
    { name: "Continuous Integration", price: new Decimal(5000000000000), description: "Item prices increase more slowly after every purchase.", icon: "", bought: false },
    { name: "Legendary Open Source Project", price: new Decimal(50000000000000), description: "10x click increase.", icon: "", bought: false }
];

export { CONSUMABLELIST, ITEMLIST, UPGRADELIST };