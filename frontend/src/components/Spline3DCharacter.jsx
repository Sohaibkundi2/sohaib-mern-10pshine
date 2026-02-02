// src/components/Spline3DCharacter.jsx
import Spline from '@splinetool/react-spline'
import { useState, useEffect, useRef } from 'react'

export default function Spline3DCharacter({ 
    isTyping = false, 
    isPasswordFocused = false 
}) {
    const [splineApp, setSplineApp] = useState(null)
    const mousePos = useRef({ x: 0, y: 0 })
    const lastActivityTime = useRef(Date.now())

    function onLoad(spline) {
        setSplineApp(spline)
        console.log('✅ Spline loaded!')
        
        // Show available objects after 1 second
        setTimeout(() => {
            const objects = spline.getAllObjects()
            console.log('📋 Objects in scene:', objects.length)
            objects.forEach((obj, i) => {
                console.log(`  ${i + 1}. "${obj.name}" (${obj.type})`)
            })
        }, 1000)
    }

    // Track mouse
    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePos.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1
            }
            lastActivityTime.current = Date.now()
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Animations
    useEffect(() => {
        if (!splineApp) return

        const interval = setInterval(() => {
            try {
                const allObjects = splineApp.getAllObjects()
                
                // Find the main mesh object (usually the first mesh)
                const mainObject = allObjects.find(obj => 
                    obj.type === 'Mesh' || 
                    obj.name?.includes('Rectangle') || 
                    obj.name?.includes('Cube') ||
                    obj.name?.includes('Shape')
                ) || allObjects[0]
                
                if (mainObject) {
                    // Typing - Bounce
                    if (isTyping) {
                        const time = Date.now() * 0.005
                        mainObject.position.y = Math.sin(time) * 20
                        mainObject.scale.set(1.1, 1.1, 1.1)
                    } else {
                        mainObject.position.y = 0
                        mainObject.scale.set(1, 1, 1)
                    }

                    // Follow cursor
                    if (!isPasswordFocused) {
                        mainObject.rotation.y = mousePos.current.x * 0.3
                        mainObject.rotation.x = mousePos.current.y * 0.2
                    } else {
                        // Turn away when password focused
                        mainObject.rotation.y = Math.PI
                    }

                    // Lonely - drift
                    const timeSinceActivity = Date.now() - lastActivityTime.current
                    if (timeSinceActivity > 5000 && !isTyping) {
                        const driftTime = Date.now() * 0.0005
                        mainObject.position.x = Math.sin(driftTime) * 10
                    } else {
                        mainObject.position.x = 0
                    }
                }
            } catch (error) {
                // Silent
            }
        }, 50)

        return () => clearInterval(interval)
    }, [splineApp, isTyping, isPasswordFocused])

    return (
        <div className="w-full h-full">
            <Spline
                scene="https://prod.spline.design/UOPMt0QJT04zz1Jg/scene.splinecode"
                onLoad={onLoad}
                className="w-full h-full scale-140"
            />
        </div>
    )
}