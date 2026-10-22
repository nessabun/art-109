const canvas = document.getElementById("jarCanvas");
const ctx = canvas.getContext("2d");

// 1. Define the Jar Boundaries
const jar = {
    x: 100,
    y: 50,
    width: 300,
    height: 400
};

// 2. Element Blueprint (Class)
class FloatingElement {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        
        // Movement speeds
        this.vx = (Math.random() - 0.5) * 1.5; // Slow horizontal drift
        this.vy = -Math.random() * 0.5 - 0.2;  // Slow upward float
        
        // Sine wave variables for organic floating sway
        this.angle = Math.random() * Math.PI * 2;
        this.swaySpeed = 0.02 + Math.random() * 0.03;
    }

    update() {
        // Apply base movement
        this.x += this.vx;
        this.y += this.vy;

        // Add a gentle side-to-side floating sway
        this.angle += this.swaySpeed;
        this.x += Math.sin(this.angle) * 0.3;

        // --- HITBOX LOGIC: Jar Wall Collisions ---
        // Left & Right walls
        if (this.x - this.radius < jar.x) {
            this.x = jar.x + this.radius;
            this.vx *= -1;
        } else if (this.x + this.radius > jar.x + jar.width) {
            this.x = jar.x + jar.width - this.radius;
            this.vx *= -1;
        }

        // Top & Bottom walls (simulate sinking/floating bounds)
        if (this.y - this.radius < jar.y) {
            this.y = jar.y + this.radius;
            this.vy *= -1; // Bounce down if it hits the lid
        } else if (this.y + this.radius > jar.y + jar.height) {
            this.y = jar.y + jar.height - this.radius;
            this.vy *= -1; // Bounce up if it hits the bottom
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

// 3. Collision Detection Between Elements (Hitbox vs Hitbox)
function checkElementCollisions(elements) {
    for (let i = 0; i < elements.length; i++) {
        for (let j = i + 1; j < elements.length; j++) {
            let el1 = elements[i];
            let el2 = elements[j];

            // Distance formula between two circle centers
            let dx = el2.x - el1.x;
            let dy = el2.y - el1.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // If distance is less than combined radii, they overlap
            if (distance < el1.radius + el2.radius) {
                // Simple bounce reaction (swap velocities)
                let tempVx = el1.vx;
                let tempVy = el1.vy;
                el1.vx = el2.vx;
                el1.vy = el2.vy;
                el2.vx = tempVx;
                el2.vy = tempVy;
                
                // Prevent overlapping stickiness by pushing them apart slightly
                let overlap = (el1.radius + el2.radius) - distance;
                let nx = dx / distance;
                let ny = dy / distance;
                el1.x -= nx * overlap * 0.5;
                el1.y -= ny * overlap * 0.5;
                el2.x += nx * overlap * 0.5;
                el2.y += ny * overlap * 0.5;
            }
        }
    }
}

// 4. Initialization & Game Loop
const elements = [
    new FloatingElement(200, 300, 20, 'rgba(255, 99, 132, 0.8)'),
    new FloatingElement(250, 200, 15, 'rgba(54, 162, 235, 0.8)'),
    new FloatingElement(180, 150, 25, 'rgba(255, 206, 86, 0.8)')
];

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Jar
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 5;
    ctx.strokeRect(jar.x, jar.y, jar.width, jar.height);

    // Update & Draw Elements
    elements.forEach(el => {
        el.update();
        el.draw();
    });

    // Check hitboxes
    checkElementCollisions(elements);

    requestAnimationFrame(animate);
}

animate();
