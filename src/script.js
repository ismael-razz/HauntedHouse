import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')



// Scene
const scene = new THREE.Scene()

const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColor = textureLoader.load('/textures/door/color.jpg')
const doorAlpha = textureLoader.load('/textures/door/alpha.jpg')
const doorAmb = textureLoader.load('/textures/door/ambientOcculsion.jpg') 
const doorHeight = textureLoader.load('/textures/door/height.jpg') 
const doorNorm = textureLoader.load('/textures/door/normal.jpg') 
const doorMetal = textureLoader.load('/textures/door/metalness.jpg') 
const doorRough = textureLoader.load('/textures/door/roughness.jpg') 

const bricksColor = textureLoader.load('textures/bricks/color.jpg')
const bricksAmb = textureLoader.load('textures/bricks/ambientOcclusion.jpg')
const bricksNorm = textureLoader.load('textures/bricks/normal.jpg')
const bricksRough = textureLoader.load('textures/bricks/roughness.jpg')

const grassColor = textureLoader.load('textures/grass/color.jpg')
const grassAmb = textureLoader.load('textures/grass/ambientOcclusion.jpg')
const grassNorm = textureLoader.load('textures/grass/normal.jpg')
const grassRough = textureLoader.load('textures/grass/roughness.jpg')

grassColor.repeat.set(8,8)
grassAmb.repeat.set(8,8)
grassNorm.repeat.set(8,8)
grassRough.repeat.set(8,8)

grassColor.wrapS = THREE.RepeatWrapping
grassAmb.wrapS = THREE.RepeatWrapping
grassNorm.wrapS = THREE.RepeatWrapping
grassRough.wrapS = THREE.RepeatWrapping

grassColor.wrapT = THREE.RepeatWrapping
grassAmb.wrapT = THREE.RepeatWrapping
grassNorm.wrapT = THREE.RepeatWrapping
grassRough.wrapT = THREE.RepeatWrapping



/**
 * House
 */
// Temporary sphere
const house = new THREE.Group()
scene.add(house)

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map: bricksColor,
        aoMap: bricksAmb,
        normalMap: bricksNorm,
        roughnessMap: bricksRough

    })
)
walls.geometry.setAttribute('uv2', 
new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
walls.position.y = 2.5 / 2
house.add(walls)

const roof = new THREE.Mesh(
    new THREE.ConeGeometry( 3.5, 1,4),
    new THREE.MeshStandardMaterial({color: '#b35f45'})
)
roof.position.y = 3
roof.rotation.y = Math.PI * .25
house.add(roof)

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColor,
        transparent: true,
        alphaMap: doorAlpha,
        aoMap: doorAmb,
        displacementMap: doorHeight,
        displacementScale: .1,
        normalMap: doorNorm,
        metalnessMap: doorMetal,
        roughnessMap: doorRough
    })
)
door.geometry.setAttribute('uv2', 
new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.y = 1
door.position.z = 2 + .01
house.add(door)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map: grassColor,
        aoMap: grassAmb,
        normalMap: grassNorm,
        roughnessMap: grassRough
     })
)
floor.geometry.setAttribute('uv2', 
new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

const bushGeo = new THREE.SphereGeometry(1, 16, 16)
const bushMat = new THREE.MeshStandardMaterial({color: '#89c854'})

const bush1 = new THREE.Mesh(bushGeo, bushMat)
bush1.scale.set(.5, .5,.5)
bush1.position.set(.8, .2, 2.2)

const bush2 = new THREE.Mesh(bushGeo, bushMat)
bush2.scale.set(.25, .25,.25)
bush2.position.set(1.4, .1, 2.1)

const bush3 = new THREE.Mesh(bushGeo, bushMat)
bush3.scale.set(.4, .4,.4)
bush3.position.set(- .8, .1, 2.2)

const bush4 = new THREE.Mesh(bushGeo, bushMat)
bush4.scale.set(.15, .15,.15)
bush4.position.set(- 1, .05, 2.6)

house.add(bush1, bush2, bush3, bush4)

const graves = new THREE.Group()
scene.add(graves)
const graveGeo = new THREE.BoxGeometry(.6, .8, .2)
const graveMat = new THREE.MeshStandardMaterial({color: '#b2b6b1'})

for(let i = 0; i < 50; i++){
    const angle = Math.random() * Math.PI * 2
    const radius = 4 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeo, graveMat)
    grave.position.set(x, .3, z)
    grave.rotation.y = (Math.random() -.5) *.4
    grave.rotation.z = (Math.random() -.5) *.4
    grave.castShadow = true
    graves.add(grave)
}




/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)


const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)
const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)
const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

renderer.shadowMap.enabled = true
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

// ...

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

// ...

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

// ...

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

// ...

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

// ...

renderer.shadowMap.type = THREE.PCFSoftShadowMap



/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const time = clock.getElapsedTime()

    const ghost1Angle = time * .5
    ghost1.position.x = Math.cos(ghost1Angle) *4 
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(time * 3)

    const ghost2Angle = - time * .3
    ghost2.position.x = Math.cos(ghost2Angle) * 7
    ghost2.position.z = Math.sin(ghost2Angle) * 7
    ghost2.position.y = Math.sin(time * 3) + Math.sin(time * 7)

    const ghost3Angle = - time * .17
    ghost3.position.x = Math.cos(ghost3Angle) * (9 + Math.sin(time * .32))
    ghost3.position.z = Math.sin(ghost3Angle) * 9
    ghost3.position.y = Math.sin(time * 3) + Math.cos(time * 2)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()