import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";

// DOM
const canvas = document.getElementById("c");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const statusEl = document.getElementById("status");

let W, H;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Scene / camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b122a);
scene.fog = new THREE.Fog(0x0b122a, 10, 50);

const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 200);
camera.position.set(0, 4.2, 12);

// Lights
const ambient = new THREE.AmbientLight(0xb6c6ff, 0.42);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
keyLight.position.set(4, 8, 6);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x7cc7ff, 0.55);
rimLight.position.set(-6, 5, -6);
scene.add(rimLight);

// Floor
const floorGeo = new THREE.PlaneGeometry(18, 200);
const floorMat = new THREE.MeshStandardMaterial({ color: 0x111a30, roughness: 0.88, metalness: 0.05 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.position.z = -80;
floor.receiveShadow = true;
scene.add(floor);

// Rails
function makeRail(x) {
  const geo = new THREE.BoxGeometry(0.25, 0.25, 200);
  const mat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, 0.13, -80);
  scene.add(m);
}
makeRail(-6.5);
makeRail(6.5);

// Player (vertical cartoon rocket with softer nose)
const player = new THREE.Group();
const engineFlames = [];

const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe7e9ef, roughness: 0.2, metalness: 0.3 });
const noseMat = new THREE.MeshStandardMaterial({ color: 0xfcbf49, roughness: 0.2, metalness: 0.25, emissive: 0x5a2a00, emissiveIntensity: 0.25 });
const finMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.32, metalness: 0.24 });
const tailMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.22, metalness: 0.42 });
const windowMat = new THREE.MeshStandardMaterial({ color: 0x9bdcfb, roughness: 0.08, metalness: 0.12, emissive: 0x3b82f6, emissiveIntensity: 0.65, transparent: true, opacity: 0.9 });

// body
const body = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 2.1, 24), bodyMat);
body.castShadow = true;
body.position.y = 1.05;
player.add(body);

// accent ring
const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.07, 10, 32), new THREE.MeshStandardMaterial({ color: 0x1d9bf0, roughness: 0.25, metalness: 0.5 }));
ring.rotation.x = Math.PI / 2;
ring.position.y = 1.2;
player.add(ring);

// softer rounded nose
const nose = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20), noseMat);
nose.scale.y = 1.2;
nose.position.y = 2.35;
player.add(nose);

// tail cone
const tailCone = new THREE.Mesh(new THREE.ConeGeometry(0.52, 0.75, 20), tailMat);
tailCone.rotation.x = Math.PI;
tailCone.position.y = 0.0;
player.add(tailCone);

// windows
for (const x of [-0.2, 0.2]) {
  const w = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 18), windowMat);
  w.scale.set(1, 1.25, 0.6);
  w.position.set(x, 1.35, 0.58);
  player.add(w);
}

// fins (3)
const finGeo = new THREE.BoxGeometry(0.18, 0.65, 0.7);
for (let i = 0; i < 3; i++) {
  const fin = new THREE.Mesh(finGeo, finMat);
  const angle = (i / 3) * Math.PI * 2;
  fin.position.set(Math.cos(angle) * 0.6, 0.5, Math.sin(angle) * 0.6);
  fin.rotation.y = angle;
  fin.castShadow = true;
  player.add(fin);
}

// flame
const flameGeo = new THREE.ConeGeometry(0.32, 0.55, 20);
const flameMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf97316, emissiveIntensity: 1.35, transparent: true, opacity: 0.94 });
const flame = new THREE.Mesh(flameGeo, flameMat);
flame.rotation.x = Math.PI;
flame.position.y = -0.12;
player.add(flame);
engineFlames.push(flame);

player.position.set(0, 0, 0);
scene.add(player);

// Stars
const starsGeo = new THREE.BufferGeometry();
const starCount = 700;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  starPos[i * 3 + 0] = (Math.random() * 2 - 1) * 60;
  starPos[i * 3 + 1] = Math.random() * 25 + 2;
  starPos[i * 3 + 2] = (Math.random() * 2 - 1) * 140;
}
starsGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
const starsMat = new THREE.PointsMaterial({ color: 0xb7d4ff, size: 0.06, transparent: true, opacity: 0.92 });
const stars = new THREE.Points(starsGeo, starsMat);
scene.add(stars);

// Exhaust trail (soft particles behind engines)
const trailCount = 60;
const trailGeo = new THREE.BufferGeometry();
const trailPos = new Float32Array(trailCount * 3);
trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
const trailMat = new THREE.PointsMaterial({ color: 0xfcbf49, size: 0.1, transparent: true, opacity: 0.65, depthWrite: false });
const trail = new THREE.Points(trailGeo, trailMat);
scene.add(trail);

// Game state
let running = false;
let gameOver = false;
let score = 0;
let best = Number(localStorage.getItem("ata3d_best") || "0");
bestEl.textContent = `Best: ${best}`;

const laneX = [-3.2, 0, 3.2];
let currentLane = 1;

const obstacles = [];

function makeMeteor() {
  const geo = new THREE.IcosahedronGeometry(1.0, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const n = 0.8 + Math.random() * 0.35;
    pos.setXYZ(i, pos.getX(i) * n, pos.getY(i) * n, pos.getZ(i) * n);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    color: 0xff7a24,
    roughness: 0.6,
    metalness: 0.18,
    emissive: 0x8c2a00,
    emissiveIntensity: 0.65
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

function resetGame() {
  for (const o of obstacles) scene.remove(o.mesh);
  obstacles.length = 0;

  running = false;
  gameOver = false;
  score = 0;
  scoreEl.textContent = "Score: 0";
  statusEl.textContent = "Press SPACE to start";

  currentLane = 1;
  player.position.x = laneX[currentLane];
  player.rotation.set(0, 0, 0);
  player.position.z = 0;
  player.position.y = 0.52;
}

function startGame() {
  if (gameOver) return;
  running = true;
  statusEl.textContent = "Running…";
}

function endGame() {
  running = false;
  gameOver = true;
  statusEl.textContent = "GAME OVER — Press SPACE to restart";
  best = Math.max(best, Math.floor(score));
  localStorage.setItem("ata3d_best", String(best));
  bestEl.textContent = `Best: ${best}`;
}

function spawnObstacle() {
  const lane = Math.floor(Math.random() * 3);
  const mesh = makeMeteor();
  mesh.position.set(laneX[lane], 0.5, -35);
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  const rot = new THREE.Vector3(
    (Math.random() * 0.8 + 0.2) * (Math.random() < 0.5 ? -1 : 1),
    (Math.random() * 0.8 + 0.2) * (Math.random() < 0.5 ? -1 : 1),
    (Math.random() * 0.4)
  );
  scene.add(mesh);
  obstacles.push({ mesh, lane, rot });
}

// Input
window.addEventListener(
  "keydown",
  (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      if (gameOver) {
        resetGame();
        startGame();
        return;
      }
      if (!running) {
        startGame();
        return;
      }
    }
    if (e.code === "ArrowLeft" || e.code === "KeyA") {
      currentLane = Math.max(0, currentLane - 1);
    }
    if (e.code === "ArrowRight" || e.code === "KeyD") {
      currentLane = Math.min(2, currentLane + 1);
    }
  },
  { passive: false }
);

function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  renderer.setSize(W, H, false);
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();

resetGame();

// Timing
const clock = new THREE.Clock();
let spawnTimer = 0;

// Speed lines
const streakCount = 200;
const streakGeo = new THREE.BufferGeometry();
const streakPositions = new Float32Array(streakCount * 3);
const streakMat = new THREE.PointsMaterial({ color: 0x4ea0ff, size: 0.05, opacity: 0.5, transparent: true });
for (let i = 0; i < streakCount; i++) {
  streakPositions[i * 3 + 0] = (Math.random() * 2 - 1) * 12;
  streakPositions[i * 3 + 1] = Math.random() * 3 + 0.4;
  streakPositions[i * 3 + 2] = Math.random() * -80;
}
streakGeo.setAttribute("position", new THREE.BufferAttribute(streakPositions, 3));
const streaks = new THREE.Points(streakGeo, streakMat);
scene.add(streaks);

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.033);

  // camera follow (gentle, always aimed at player)
  camera.position.x += (player.position.x * 0.12 - camera.position.x) * 0.1;
  camera.position.z = 12;
  camera.position.y = 4.2;
  camera.lookAt(player.position.x, 1.0, player.position.z - 6);

// ship hover + thruster pulse
const t = clock.elapsedTime;
player.position.y = 0.52 + Math.sin(t * 3.2) * 0.04;
for (const f of engineFlames) {
  const s = 0.9 + Math.sin(t * 18) * 0.12;
  f.scale.set(1, s, 1);
}

  // trail refresh
  for (let i = 0; i < trailCount; i++) {
    const b = i * 3;
    trailPos[b + 0] = player.position.x + (Math.random() * 0.5 - 0.25);
    trailPos[b + 1] = 0.3 + Math.random() * 0.3;
    trailPos[b + 2] = player.position.z + 0.8 + Math.random() * 0.8;
  }
  trail.geometry.attributes.position.needsUpdate = true;

  // speed lines motion
  const streakArray = streakGeo.attributes.position.array;
  for (let i = 0; i < streakCount; i++) {
    const idx = i * 3 + 2;
    streakArray[idx] += (18 + score * 0.02) * dt;
    if (streakArray[idx] > 4) {
      streakArray[idx] = -80;
      streakArray[i * 3 + 0] = (Math.random() * 2 - 1) * 12;
      streakArray[i * 3 + 1] = Math.random() * 3 + 0.4;
    }
  }
  streakGeo.attributes.position.needsUpdate = true;

  // smooth lane move
  const targetX = laneX[currentLane];
  player.position.x += (targetX - player.position.x) * 0.18;
  player.rotation.z = -(targetX - player.position.x) * 0.08;

  // subtle motion
  stars.rotation.y += dt * 0.03;

  if (running && !gameOver) {
    score += dt * 20;
    scoreEl.textContent = `Score: ${Math.floor(score)}`;

    // spawn
    spawnTimer += dt;
    const spawnEvery = Math.max(0.55, 1.05 - score * 0.002);
    if (spawnTimer >= spawnEvery) {
      spawnTimer = 0;
      spawnObstacle();
    }

    // move obstacles
    const speed = 12 + score * 0.03;
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i];
      o.mesh.position.z += speed * dt;
      o.mesh.rotation.x += o.rot.x * dt;
      o.mesh.rotation.y += o.rot.y * dt;
      o.mesh.rotation.z += o.rot.z * dt;

      if (o.mesh.position.z > 10) {
        scene.remove(o.mesh);
        obstacles.splice(i, 1);
        continue;
      }

      const zDist = Math.abs(o.mesh.position.z - player.position.z);
      const sameLane = Math.abs(o.mesh.position.x - player.position.x) < 1.2;
      if (sameLane && zDist < 1.1) {
        endGame();
      }
    }
  }

  renderer.render(scene, camera);
}
animate();
