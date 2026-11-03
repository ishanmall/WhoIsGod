import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles as DreiSparkles } from '@react-three/drei';
import {
  ArrowUp,
  BookOpen,
  Volume2,
  VolumeX,
  Languages,
  Search,
  Sparkles,
  Eye,
  Compass
} from 'lucide-react';

// ============================================================================
// 1. SUBTLE UI CLICK CHIME
// ============================================================================
let audioCtx = null;
const playUISound = (freq = 528) => {
  if (typeof window === 'undefined') return;
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.004, audioCtx.currentTime + 0.05);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.05);
  } catch (e) {
    console.warn('Web Audio API not supported', e);
  }
};

// ============================================================================
// 2. 6 DIVINE REALMS COLOR & GLASS AURA CONFIGURATION
// ============================================================================
const REALM_THEMES = [
  {
    id: 'mahadev',
    hiName: 'महादेव',
    enName: 'Mahadev',
    primary: '#4f46e5',
    secondary: '#06b6d4',
    blob1: 'rgba(79, 70, 229, 0.32)',
    blob2: 'rgba(6, 182, 212, 0.28)',
    borderGlow: 'rgba(79, 70, 229, 0.45)'
  },
  {
    id: 'maa',
    hiName: 'माँ आदि-शक्ति',
    enName: 'Adi-Shakti',
    primary: '#e11d48',
    secondary: '#f97316',
    blob1: 'rgba(225, 29, 72, 0.30)',
    blob2: 'rgba(249, 115, 22, 0.26)',
    borderGlow: 'rgba(225, 29, 72, 0.45)'
  },
  {
    id: 'vishnu',
    hiName: 'भगवान विष्णु',
    enName: 'Lord Vishnu',
    primary: '#0284c7',
    secondary: '#eab308',
    blob1: 'rgba(2, 132, 199, 0.30)',
    blob2: 'rgba(234, 179, 8, 0.26)',
    borderGlow: 'rgba(2, 132, 199, 0.45)'
  },
  {
    id: 'lakshmi',
    hiName: 'माँ लक्ष्मी',
    enName: 'Maa Lakshmi',
    primary: '#d97706',
    secondary: '#ec4899',
    blob1: 'rgba(217, 119, 6, 0.28)',
    blob2: 'rgba(236, 72, 153, 0.28)',
    borderGlow: 'rgba(217, 119, 6, 0.45)'
  },
  {
    id: 'brahma',
    hiName: 'ब्रह्मा',
    enName: 'Lord Brahma',
    primary: '#ea580c',
    secondary: '#dc2626',
    blob1: 'rgba(234, 88, 12, 0.30)',
    blob2: 'rgba(220, 38, 38, 0.25)',
    borderGlow: 'rgba(234, 88, 12, 0.45)'
  },
  {
    id: 'saraswati',
    hiName: 'माँ सरस्वती',
    enName: 'Maa Saraswati',
    primary: '#0d9488',
    secondary: '#6366f1',
    blob1: 'rgba(13, 148, 136, 0.30)',
    blob2: 'rgba(99, 102, 241, 0.28)',
    borderGlow: 'rgba(13, 148, 136, 0.45)'
  }
];

// ============================================================================
// 3. ENHANCED 3D SACRED COSMIC MANDALA + GLASS TORUS KNOT
// ============================================================================
function SacredMandala3D({ scrollProgress, activeRealmIndex, zenMode }) {
  const outerGroupRef = useRef();
  const torusKnotRef = useRef();
  const merkabaUpRef = useRef();
  const merkabaDownRef = useRef();
  const sudarshanRing1Ref = useRef();
  const sudarshanRing2Ref = useRef();
  const lotusPetalsRef = useRef();
  const binduCoreRef = useRef();

  const targetPrimary = useMemo(() => new THREE.Color('#4f46e5'), []);
  const targetSecondary = useMemo(() => new THREE.Color('#06b6d4'), []);
  const currentPrimary = useRef(new THREE.Color('#4f46e5'));
  const currentSecondary = useRef(new THREE.Color('#06b6d4'));

  const petalPositions = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => {
      const angle = (i / 16) * Math.PI * 2;
      return {
        x: Math.cos(angle) * 2.8,
        y: Math.sin(angle) * 2.8,
        z: 0,
        rotZ: angle
      };
    });
  }, []);

  useFrame((state, delta) => {
    const theme = REALM_THEMES[activeRealmIndex] || REALM_THEMES[0];
    targetPrimary.set(theme.primary);
    targetSecondary.set(theme.secondary);

    currentPrimary.current.lerp(targetPrimary, delta * 2.5);
    currentSecondary.current.lerp(targetSecondary, delta * 2.5);

    const speedMult = zenMode ? 1.8 : 1;
    const scrollNormalized = scrollProgress / 100;
    const t = state.clock.elapsedTime * speedMult;

    if (outerGroupRef.current) {
      outerGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        outerGroupRef.current.rotation.y,
        scrollNormalized * Math.PI * 2.5 + Math.sin(t * 0.25) * 0.3,
        0.05
      );
      outerGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        outerGroupRef.current.rotation.x,
        Math.cos(scrollNormalized * Math.PI * 2) * 0.35,
        0.05
      );
    }

    if (torusKnotRef.current) {
      torusKnotRef.current.rotation.y += delta * 0.3 * speedMult;
      torusKnotRef.current.rotation.x += delta * 0.18 * speedMult;
      torusKnotRef.current.material.color.copy(currentPrimary.current);
      torusKnotRef.current.material.emissive.copy(currentSecondary.current);
    }

    if (merkabaUpRef.current) {
      merkabaUpRef.current.rotation.y += delta * 0.45 * speedMult;
      merkabaUpRef.current.rotation.z += delta * 0.2 * speedMult;
      merkabaUpRef.current.material.color.copy(currentPrimary.current);
      merkabaUpRef.current.material.emissive.copy(currentPrimary.current);
    }

    if (merkabaDownRef.current) {
      merkabaDownRef.current.rotation.y -= delta * 0.45 * speedMult;
      merkabaDownRef.current.rotation.x -= delta * 0.2 * speedMult;
      merkabaDownRef.current.material.color.copy(currentSecondary.current);
      merkabaDownRef.current.material.emissive.copy(currentSecondary.current);
    }

    if (sudarshanRing1Ref.current) {
      sudarshanRing1Ref.current.rotation.z -= delta * 0.35 * speedMult;
      sudarshanRing1Ref.current.rotation.x = Math.sin(t * 0.5) * 0.55;
      sudarshanRing1Ref.current.material.color.copy(currentPrimary.current);
    }

    if (sudarshanRing2Ref.current) {
      sudarshanRing2Ref.current.rotation.z += delta * 0.25 * speedMult;
      sudarshanRing2Ref.current.rotation.y = Math.cos(t * 0.4) * 0.65;
      sudarshanRing2Ref.current.material.color.copy(currentSecondary.current);
    }

    if (lotusPetalsRef.current) {
      lotusPetalsRef.current.rotation.z = t * 0.15 + scrollNormalized * Math.PI;
    }

    if (binduCoreRef.current) {
      const pulse = 1 + Math.sin(t * 2.2) * 0.16;
      binduCoreRef.current.scale.set(pulse, pulse, pulse);
      binduCoreRef.current.rotation.y -= delta * 0.6 * speedMult;
      binduCoreRef.current.material.color.copy(currentPrimary.current);
      binduCoreRef.current.material.emissive.copy(currentSecondary.current);
    }
  });

  const activeTheme = REALM_THEMES[activeRealmIndex] || REALM_THEMES[0];

  return (
    <group ref={outerGroupRef} position={[0, 0, -1.2]}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.9}>
        {/* 1. Sacred Ananta Torus Knot */}
        <mesh ref={torusKnotRef}>
          <torusKnotGeometry args={[1.15, 0.22, 180, 28]} />
          <meshStandardMaterial
            wireframe
            emissiveIntensity={0.55}
            transparent
            opacity={0.38}
          />
        </mesh>

        {/* 2. Central Pulsating Bindu */}
        <mesh ref={binduCoreRef}>
          <icosahedronGeometry args={[0.65, 1]} />
          <meshStandardMaterial
            wireframe
            emissiveIntensity={0.7}
            transparent
            opacity={0.55}
          />
        </mesh>

        {/* 3. Upward Shiva Tetrahedron */}
        <mesh ref={merkabaUpRef}>
          <octahedronGeometry args={[2.0, 0]} />
          <meshStandardMaterial
            wireframe
            emissiveIntensity={0.45}
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* 4. Downward Shakti Tetrahedron */}
        <mesh ref={merkabaDownRef} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
          <octahedronGeometry args={[2.0, 0]} />
          <meshStandardMaterial
            wireframe
            emissiveIntensity={0.45}
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* 5. Inner Sudarshan Chakra Ring */}
        <mesh ref={sudarshanRing1Ref}>
          <torusGeometry args={[2.8, 0.022, 16, 120]} />
          <meshBasicMaterial transparent opacity={0.55} />
        </mesh>

        {/* 6. Outer Kalachakra Ring */}
        <mesh ref={sudarshanRing2Ref}>
          <torusGeometry args={[3.6, 0.018, 16, 120]} />
          <meshBasicMaterial transparent opacity={0.42} />
        </mesh>

        {/* 7. 16 Sacred Lotus Geometric Petals */}
        <group ref={lotusPetalsRef}>
          {petalPositions.map((p, idx) => (
            <mesh
              key={idx}
              position={[p.x, p.y, p.z]}
              rotation={[0, 0, p.rotZ + Math.PI / 4]}
            >
              <torusGeometry args={[0.45, 0.012, 12, 4]} />
              <meshBasicMaterial
                color={idx % 2 === 0 ? activeTheme.primary : activeTheme.secondary}
                transparent
                opacity={0.36}
              />
            </mesh>
          ))}
        </group>
      </Float>

      {/* Cosmic Prana Particles */}
      <DreiSparkles
        count={140}
        scale={14}
        size={2.6}
        speed={0.45}
        opacity={0.55}
        color={activeTheme.primary}
      />
      <DreiSparkles
        count={90}
        scale={10}
        size={2.0}
        speed={0.35}
        opacity={0.45}
        color={activeTheme.secondary}
      />
    </group>
  );
}

// ============================================================================
// 4. SINGLE CONST GOD: (1st before ' , ' = Hindi | 2nd after ' , ' = English)
// ============================================================================
const God = `भगवान कौन हैं? , Who Is God?

परम सत्य और अद्वैत चिंतन , Supreme Truth & Non-Dual Contemplation

महादेव • आदि-शक्ति • विष्णु • लक्ष्मी • ब्रह्मा • सरस्वती , Mahadev • Adi-Shakti • Vishnu • Lakshmi • Brahma • Saraswati

श्लोक, उपनिषद, या दर्शन खोजें... , Search stanzas, Upanishads, or philosophy...

अहं ब्रह्मास्मि • शिवोऽहम् , Aham Brahmasmi • Shivoham

आवाज़ चालू , Voice ON

आवाज़ बंद , Voice OFF

ध्यान दर्शन , Sacred View

पठन मोड , Reading View

महादेव कौन हैं? , Who is Mahadev?
महादेव वह हैं जो जन्म से परे हैं— , Mahadev is beyond birth—
न आदि, न अंत। , without beginning and without end.
वे अजन्मा हैं, , He is unborn,
स्वयंभू हैं। , Swayambhu (Self-created).
वे अस्तित्व और अनस्तित्व दोनों के साक्षी ही नहीं, , He is not only the witness of existence and non-existence,
बल्कि उनका आधार भी हैं। , but also their very foundation.
वह परम शून्य, , He is the absolute void (Param Shunya)
जिसके गर्भ से प्रकाश प्रकट हुआ। , from which Light manifested.

वे वह 'निष्कल' (निराकार) ब्रह्म हैं , He is the 'Nishkala' (Formless) Brahman
जो 'सकल' (साकार) रूप में प्रकट होते हैं। , who manifests as 'Sakala' (With Form).
वे वह अनादि-अनंत 'ज्योतिर्लिंग' हैं, , He is the beginningless and endless 'Jyotirlinga' (Column of Light),
जिसके छोर खोजने में ब्रह्मा और विष्णु भी असमर्थ रहे। , whose limits even Brahma and Vishnu could not fathom.
अग्नि स्तंभ के रूप में, , As the pillar of fire,
वे ही ब्रह्मांड की धुरी हैं। , He is the axis of the universe.
वे विद्याओं के तीर्थ हैं, , He is the pilgrimage of all knowledge,
अविनाशी हैं, , indestructible,
विश्वनाथ हैं, , Vishwanath (Lord of the Universe),
और काल से भी परे—कालोपरी हैं। , and beyond time—Kalopari.
समस्त कारणों के प्रमुख कारण, , He is the primary cause of all causes,
वे ही अनंत ज्योतिर्लिंग हैं। , the infinite Jyotirlinga.

जो दिखाई देता है वह सृष्टि है; , What is visible is creation;
जो सृष्टि से भी परे है, वही महादेव है। , that which is beyond creation is Mahadev.
जो सुना जा सकता है वह शब्द है; , What can be heard is sound;
जो शब्दातीत है, वही महादेव है। , that which is beyond sound is Mahadev.
वे ही ओंकार हैं— , He is Omkara—
अकार, उकार और मकार से परे जो तुरीय अवस्था है, , beyond the syllables A, U, and M, the transcendent fourth state (Turiya),
वही महादेव हैं। , that is Mahadev.
वे उस मौन की गूंज हैं , He is the roaring silence
जो ब्रह्मांड के कण-कण में व्याप्त है। , that permeates every atom of the cosmos.

ऋग्वेद के रुद्र सूक्त में, , In the Rudra Suktam of the Rigveda,
वे ही वह भयंकर झंझावात हैं, , He is the terrifying cosmic storm
जो अज्ञान के बादलों को फाड़ देते हैं। , that viciously tears apart the clouds of ignorance.
श्वेताश्वतर उपनिषद घोषणा करता है: , The Shvetashvatara Upanishad boldly declares:
"एको हि रुद्रो न द्वितीयाय तस्थुः"— , "Eko hi Rudro na dvitiyaya tasthuh"—
केवल एक रुद्र है, दूसरा कोई नहीं। , There is only one Rudra, there is no second.
वे वह 'महेश्वर' हैं, जो इस सम्पूर्ण माया के जाल को बुनते हैं, , He is the 'Maheshwara' (Supreme Lord) who flawlessly weaves the entire web of Maya,
और फिर स्वयं ही उस जाल में , and then secretly sits inside that very web
एक साधारण जीव की भांति छिप कर बैठ जाते हैं। , disguised as an ordinary, mortal being.
वे वह ब्रह्मांडीय मकड़ी हैं, , He is the cosmic spider,
और यह असीम अंतरिक्ष उनका जाला है। , and this infinite expanse of space is His majestic web.

पृथ्वी की स्थिरता भी वही, , He is the stillness of earth
आकाश की अनंतता भी वही। , and the infinity of space.
अग्नि का ताप, जल का प्रवाह और वायु का वेग— , He is the heat of fire, the flow of water,
सब शिव है। , and the speed of wind.
वे महापर्वत भी हैं और सूक्ष्म कण भी; , He is the great mountain, and also the microscopic particle;
वे पृथ्वी भी हैं, वे आकाश भी हैं। , He is the earth, He is the sky.
काल भी वही हैं और काल से परे महाकाल भी। , He is Time and beyond time—He is Mahakaal.

जब उनका डमरू बजता है, , When His Damru beats,
तो समय का जन्म होता है (नादब्रह्म)। , Time is born (Nada-Brahman).
और जब वे तांडव करते हैं, , And when He performs the Tandava,
तो प्रलय और सृजन एक साथ नृत्य करते हैं। , destruction and creation dance together.
वे ही तांडव के अधिपति हैं, , He is the Lord of the Tandava,
जिनके नृत्य से सृष्टि की गति चलती है। , whose dance drives the motion of creation.

शिव और नारायण में कोई भेद नहीं। , There is no difference between Shiva and Narayana.
"शिवाय विष्णुरूपाय, शिवरूपाय विष्णवे"— , "Shivaya Vishnu Rupaya, Shivarupaya Vishnave"—
शिव विष्णु का रूप हैं और विष्णु शिव का। , Shiva is the form of Vishnu, and Vishnu is the form of Shiva.
जब सृष्टि का पालन करना होता है, वे विष्णु हैं; , When preserving creation, He is Vishnu;
जब संहार कर नवीनीकरण करना होता है, वे रूद्र हैं। , when destroying to renew, He is Rudra.

वे निर्गुण भी हैं और सगुण भी। , He is both attribute-less and with attributes.
निराकार होकर भी साकार में प्रकट होते हैं। , Formless, yet manifest in form.
एकांत में भी पूर्ण, और सर्वत्र होकर भी अलिप्त। , Complete in solitude, untouched while being everywhere.
वे 'शून्य' हैं जिसमें सब समा जाता है, , He is the 'Zero' (Shunya) into which everything dissolves,
और 'अनंत' हैं जिससे सब निकलता है। , and the 'Infinity' from which everything emerges.

वे जीव भी हैं, और ब्रह्म भी वही हैं। , He is the soul (Jiva), and also Brahman.
वे विकराल काल भी हैं, , He is the terrifying Time,
और समस्त लोकों के पालनकर्ता भी वही हैं। , and also the preserver of all realms.
वे अमर हैं, , He is immortal, yet present in every death,
और प्रत्येक मृत्यु में वही मरते भी हैं। , and He dies in every death.
विष भी वही हैं और अमृत भी; , He is poison and nectar;
बंधन भी वही हैं और मुक्ति भी। , bondage and liberation.
ज्ञान भी वही हैं और अज्ञान के पार भी; , Knowledge and beyond ignorance;
प्रकाश भी वही हैं और अंधकार का आधार भी। , light and the ground of darkness.
वे दुविधा भी हैं, और निर्णय भी वही हैं; , He is the dilemma, and He is the decision;
शांति भी हैं, और समस्त अशांति भी वही हैं। , He is peace, and all restlessness.
उनका तीसरा नेत्र केवल विनाश नहीं, , His Third Eye is not just destruction,
बल्कि भ्रम (माया) के नाश का प्रतीक है। , but the incineration of illusion (Maya).

वे 'रुद्र' हैं—भयंकर गर्जना करने वाले, , He is 'Rudra'—the fierce roarer,
फिर भी 'वैद्यनाथ' (चिकित्सकों के नाथ) बनकर , yet also 'Vaidyanatha' (Lord of Physicians)
संसार के दुखों को हरने वाले। , who heals the sorrows of the world.
वे वह महान मायापति हैं, , He is the supreme Lord of Illusion (Mayapati),
जो एक होकर भी अनेक रूपों में इस संसार का संचालन करते हैं। , who, though One, orchestrates this manifold universe.

शिव सूत्र का प्रथम श्लोक कहता है: , The very first verse of the Shiva Sutras declares:
"चैतन्यमात्मा"— , "Chaitanyamatma"—
अर्थात् शिव कोई व्यक्ति नहीं, बल्कि स्वयं विशुद्ध चेतना हैं। , meaning Shiva is not a person, but Pure Consciousness itself.
वे अद्वैत के जीवंत प्रमाण हैं— , He is the living proof of Advaita (Non-duality)—
एक ही समय में सर्वत्र उपस्थित, और कहीं भी नहीं। , existing everywhere simultaneously, yet absolutely nowhere.
मांडूक्य उपनिषद के अनुसार, , According to the Mandukya Upanishad,
वे जाग्रत, स्वप्न और सुषुप्ति—तीनों अवस्थाओं के साक्षी हैं, , He is the silent witness of the waking, dreaming, and deep sleep states,
और स्वयं 'तुरीय' (चौथी अवस्था) हैं। , and He Himself is 'Turiya' (the transcendent fourth state).
जब आप उन्हें नहीं खोजते, वे सर्वव्यापी मौन हैं; , When you do not seek Him, He is an all-pervading silence;
जब आप ध्यान की गहराई में उतरते हैं, , the exact moment you descend into the depths of meditation,
तो वे ही एकमात्र सत्य बन जाते हैं। , He becomes the only undeniable Truth.

शिव पुराण के अनुसार , According to the Shiva Purana,
सृष्टि से पहले सदाशिव ही थे; , before creation, there was only Sadashiva;
उनसे ही शक्ति प्रकट हुई, , from Him, Shakti manifested,
और उसी से सम्पूर्ण ब्रह्मांड की उत्पत्ति हुई। , and from that, the entire universe was born.
उनके पाँच मुख— , His five faces—
सद्योजात, वामदेव, अघोर, तत्पुरुष और ईशान— , Sadyojata, Vamadeva, Aghora, Tatpurusha, and Ishana—
ही सृष्टि के पांच कार्य करते हैं: , perform the five cosmic acts:
सृजन, स्थिति, संहार, तिरोभाव और अनुग्रह। , Creation, Preservation, Destruction, Concealment (Maya), and Grace (Mukti).

वे महायोगी हैं, , He is the great yogi,
शक्तिपति हैं, जिनके तेज से ब्रह्मांड प्रकाशित है। , the life-giving force whose radiance illuminates the universe.
वे अर्धनारीश्वर हैं— , He is Ardhanarishvara—
यह सिद्ध करते हुए कि पुरुष (चेतना) और प्रकृति (पदार्थ) अलग नहीं हैं। , proving that Purusha (Consciousness) and Prakriti (Nature) are indivisible.
शक्ति के बिना शिव स्पंदनहीन हैं, , Without Shakti, Shiva is inert,
और शिव के बिना शक्ति दिशाहीन है। , and without Shiva, Shakti is directionless.
वे आदियोगी हैं, , He is Adiyogi,
और योग, ध्यान और समाधि के प्रथम गुरु भी वही हैं। , the first guru of yoga, meditation, and samadhi.
वे ही पंचाक्षरी मंत्र “ॐ नमः शिवाय” के अधिष्ठाता हैं, , He is the presiding deity of the Panchakshari mantra "Om Namah Shivaya",
जो पंचमहाभूतों और समस्त वेदों का सार है। , which is the essence of the five elements and all the Vedas.

वे सत्य हैं, वे सुंदरम् हैं। , He is Truth. He is Beauty itself.
व्याघ्रचर्म उनका वस्त्र, जटाएँ उनका आकाश। , Clad in tiger skin, bearing matted locks as the sky.
वे गंगाधर, चंद्रशेखर, त्रिलोचन और वही नटराज भी हैं। , He is Gangadhar, Chandrashekhar, Trilochan, and also Nataraj.
उनका वर्ण कर्पूर के समान श्मशान-गौर है। , His complexion is as white as camphor and the ashes of the cremation ground.
नीलकंठ—विष धारण कर अमृत का मार्ग खोलने वाले। , Neelkanth—who held poison to reveal immortality.
सर्प उनका कंठहार और आभूषण है, , A serpent is His necklace and ornament,
रुद्राक्ष उनका वैभव। , Rudraksha His wealth.

हाथ में त्रिशूल, , Trident in hand,
भस्म से लिप्त शरीर, , ash upon the body,
नेत्रों में परमानंद, , supreme bliss in His eyes,
और मुख पर भोलेपन की मुस्कान। , and an innocent smile on His face.
श्मशान की राख में जो जीवन का सत्य देख ले, वही महादेव है। , He who finds purity in the ash of the cremation ground is Mahadev.
वे सौन्दर्य की परिभाषा हैं, , He is the definition of beauty,
और आकर्षण की पराकाष्ठा भी वही हैं। , and the pinnacle of attraction.
वे आशुतोष हैं, , He is Ashutosh,
क्षण भर में प्रसन्न होने वाले भोलानाथ। , the innocent Lord (Bholenath) who is pleased in an instant.
वे कैलाशपति कहलाते हैं, , Called the Lord of Kailash,
पर समूचा संसार ही उनका निवास स्थान है। , yet the entire world is His abode.
वे सर्वव्यापी हैं, पंचमहाभूतों के स्वामी—भूतनाथ हैं। , He is omnipresent, master of the five elements—Bhutnath.

वही हैं देवों के देव—महादेव। , He is the God of Gods—Mahadev.
महादेव वह हैं जो नहीं हैं, , Mahadev is that which is not,
और जो नहीं है—वही महादेव हैं। , and that which is not—is Mahadev.
जो अस्तित्व के भी परे है, वही महादेव हैं। , That which is beyond existence is Mahadev.
वे एकमात्र शक्ति हैं जिनके तेज से समस्त संसार प्रकाशित है। , He is the only power whose radiance illuminates the entire world.
वे जीवनदायी शक्ति हैं, जिनके अभाव में: , He is the life-giving force, without which:
कर्ण श्रवण योग्य नहीं, , the ear cannot hear,
जिह्वा वाणी योग्य नहीं, , the tongue cannot speak,
मन विचार योग्य नहीं। , the mind cannot think.

महादेव को परिभाषित करना संभव नहीं, , Mahadev cannot be defined,
क्योंकि उन्हें किसी तत्व से अलग कर के देखना ही असंभव है। , for nothing exists separate from Him.
संसार के सभी तत्व उन्हीं से उत्पन्न हैं। , All elements of the world are born from Him.
सब उन्हें जानते हैं, पर उनके पूर्ण स्वरूप को कोई जानता नहीं है। , Everyone knows His name, but no one knows His totality.
और जिसे यह लगता है कि उसने महादेव को पूर्णतः जान लिया है, , And he who thinks he has fully known Mahadev,
वास्तव में वह अभी कुछ भी नहीं जानता। , actually knows nothing yet.
वे केवल 'देव' नहीं, वे 'तत्व' हैं। , He is not just a God; He is the Elemental Truth.

वे वैरागी हैं— , He is detached (Vairagi)—
उन्हें न सम्मान का मोह है, न अपमान का भय। , no attachment to honor, no fear of insult.
न उनका कोई शत्रु है, न मित्र। , No enemy, no friend.
न अपना, न पराया। , No one as his own, and no one as a stranger.
न लेने की आकांक्षा, न कुछ पाने की इच्छा। , No aspiration to take, no desire to attain anything.
वे अघोर हैं— , He is Aghor—
जो घृणा से परे है, , beyond disgust,
जिसे पवित्र और अपवित्र में कोई भेद नहीं दिखता। , seeing no difference between the holy and the unholy.

वे हैं भी और नहीं भी। , He is, and He is not.
हर स्वरूप में वही हैं, , He is in every form,
हर समय में वही हैं, , He is in every time,
हर स्थान पर वही हैं। , He is in every place.
हमारे सुख भी उनके हैं, , Our joys are His,
और हमारे दुःख भी उनके ही हैं। , and our sorrows are His too.
उनके बिना सब कुछ शव समान है— , Without Him, all is lifeless (Shava)—
स्पंदनहीन, अर्थहीन। , inert, meaningless.
अंत में जो शेष रह जाता है, वही शिव है। , In the end, that which remains... is Shiva.

कठोपनिषद में कहा गया है कि , The Kathopanishad terrifyingly reveals that
मृत्यु भी जिनके लिए केवल एक व्यञ्जन (भोजन) है, , He for whom even death is merely a condiment (food),
वे महाकाल ही शिव हैं। , that Supreme Time (Mahakaal) is Shiva.
वे चिदाकाश (चेतना का आकाश) का वह परम अंधकार हैं, , He is the absolute darkness of Chid-Akasha (the sky of consciousness)
जो युगों, कल्पों और सृष्टियों को अपने भीतर निगल जाता है। , that mercilessly swallows entire Yugas, Kalpas, and creations into its void.
क्या यह महादेव का ही वह 'नीलकंठ' स्वरूप नहीं है, , Is this not the ultimate 'Neelkanth' form of Mahadev,
जो ब्रह्मांड के सारे कर्मों और प्रलय के विष को , holding the concentrated poison of cosmic dissolution and karma
अपनी असीम शून्यता में धारण किए हुए है? , within His infinite emptiness?
अनादि काल से जो भस्म वे अपने शरीर पर रमाए हुए हैं, , The ash He smears upon His body since the dawn of time
वह ब्रह्मांडों के जलने के बाद बची हुई वह राख है, , is the cosmic dust of burned-out universes,
जो कभी नष्ट नहीं होती। , a residue that can never be destroyed.

विज्ञान भैरव तंत्र के अनुसार, , According to the Vijnana Bhairava Tantra,
शिव कोई देवता नहीं, , Shiva is not a deity to be found in the skies,
बल्कि दो श्वासों के बीच का वह 'ठहराव' (Spanda) हैं। , but the 'Spanda' (tremor) resting between two breaths.
वे उस डमरू की दो ध्वनियों के बीच का वह 'मौन' हैं, , He is the profound 'Silence' lingering between two consecutive beats of His cosmic Damru,
जिसमें सारा अस्तित्व एक पल के लिए विलंबित है। , the terrifying pause where all existence hangs in sheer suspense.
यदि आप ध्यान से देखें, , If you observe closely enough,
तो आपके भीतर भीतर जाने वाली और बाहर आने वाली हर श्वास , every inhalation and exhalation within your chest
उनका 'सोऽहं' (मैं वह हूँ) मंत्र ही है। , is His silent 'So-Ham' (I am That) mantra repeating itself.
वे वह परम शून्य हैं , He is the Ultimate Void
जो स्वयं को एक ब्रह्मांडीय माया के दर्पण में देखकर , looking into the mirror of Maya,
संसार का भ्रम रचते हैं। , intentionally creating the grand illusion of a cosmos just to experience it.

जिस भस्म को वे धारण करते हैं, , The ash He smears on His immortal body
वह केवल चिता की राख नहीं है— , is not merely the dust of the cremation ground—
वह आपके अहंकार, आपकी असीमित इच्छाओं , it is a brutal reminder of the ultimate future of your ego, your desires,
और इस नश्वर संसार का अंतिम सत्य है। , and this entire mortal world.

क्या आपको लगता है कि आप प्रार्थना कर रहे हैं? , Do you honestly believe that you are the one praying?
जब आप 'ॐ नमः शिवाय' जपते हैं, , When you fervently chant 'Om Namah Shivaya',
तो वास्तव में शिव ही आपके भीतर से , it is actually Shiva whispering from deep within you,
स्वयं शिव को पुकार रहे हैं। , calling out to Shiva Himself.

आपकी चेतना की गहराई में बैठा , Who is that nameless, faceless observer (Sakshi)
वह अनाम दृष्टा (साक्षी) कौन है? , sitting in the darkest depths of your consciousness?
वह जो आपके सुख को दूर से देखता है, , The one who silently watches your fleeting joys,
जो आपके दुःख को मौन होकर देखता है, , who objectively witnesses your crushing sorrows,
और जो आपके गहरी नींद में सो जाने के बाद भी , and who remains wide awake, watching over you
निरंतर जागता रहता है? , even when you are lost in the deepest, dreamless sleep?
वही शिव है। , That eternal witness is Shiva.

जिस दिन आप अद्वैत के इस सत्य को जान जाएंगे कि "जीव ही शिव है" (शिवोऽहम्), , The exact day you realize the non-dual truth that "The individual soul is Shiva" (Shivoham),
उस दिन पत्थरों की मूर्तियों और कर्मकांडों की आवश्यकता समाप्त हो जाएगी। , the desperate need for stone idols and rituals will instantly vanish.
उस दिन आप अचानक पाएंगे , On that day, you will suddenly, terrifyingly realize
कि आप ब्रह्मांड के किनारे पर खड़े कोई तुच्छ प्राणी नहीं हैं; , that you are not an insignificant creature standing on the edge of the universe;
आप ही वह धड़कता हुआ बिंदु (Bindu) हैं , you are the very pulsating center (Bindu)
जहाँ से यह पूरा ब्रह्मांड जन्म ले रहा है। , from which the entire cosmos is currently being born.

क्या आप अपने अस्तित्व की , Do you have the sheer, unimaginable courage
उस परम भैरव अवस्था में गोता लगाने का साहस रखते हैं? , to dive headfirst into that absolute Bhairava state of your own existence?
जहाँ आप वह सब कुछ हमेशा के लिए खो देंगे , A place where you will permanently lose everything
जिसे आप 'अपना' कहते हैं, , that you falsely call 'mine',
और वह सब कुछ पा लेंगे , only to finally discover everything
जो वास्तव में 'आप' हैं। , that you actually 'are'.

बाहर खोजना बंद करें। , Stop searching on the outside.
नेत्र बंद करें। , Close your eyes.
डमरू की ध्वनि कहीं और नहीं, आपके भीतर ही बज रही है। , The cosmic Damru is beating nowhere else but exclusively within you.

माँ (आदि-शक्ति) कौन हैं? , Who is Maa (Adi-Shakti)?
माँ आदि-शक्ति हैं। , Maa is the Primal Power (Adi-Shakti).
वे परब्रह्म की सक्रिय शक्ति हैं। , She is the dynamic, kinetic aspect of the Absolute Brahman.
समस्त ब्रह्मांड में जो ऊर्जा स्पंदित है, , She is the pure energy pulsating
वही माँ हैं। , throughout the veins of the entire cosmos.
सर्वभूतों के श्वास में जो ऊष्मा और जीवन का ताप है, , She is the warmth in the breath of all living beings
वही माँ हैं। , and the very heat of life itself.

मनुष्य की नाभि में स्थित कुण्डलिनी शक्ति वही हैं। , She is the dormant Kundalini force residing in the navel.
ग्रह-नक्षत्रों की गति, , The relentless movement of planets,
काल का प्रवाह, , the unending flow of time,
सृष्टि की लय— , the flawless rhythm of creation—
सब माँ की अभिव्यक्ति है। , all are but mere expressions of Maa.

ऋग्वेद के देवी सूक्त (वाम्भृणी सूक्त) में, , In the Devi Suktam of the Rigveda,
वे स्वयं गर्जना करती हैं: , She Herself roars across the heavens:
"अहं राष्ट्री संगमनी वसूनां"— , "Aham rashtri sangamani vasunam"—
मैं ही सम्पूर्ण राष्ट्र (ब्रह्मांड) को एक सूत्र में बांधने वाली शक्ति हूँ, , I am the Sovereign Queen, the gatherer of treasures,
मैं ही ज्ञान का केंद्र हूँ। , the one who binds the entire universe together.
वे ही वह 'मूल प्रकृति' हैं, , She is 'Mula Prakriti' (The Root Nature),
जिससे महत, अहंकार और पंचतन्मात्राएं उत्पन्न हुईं। , from which intellect, ego, and the elements are born.

ब्रह्मा, विष्णु और महेश भी नतमस्तक होकर स्वीकार करते हैं , Even Brahma, Vishnu, and Shiva bow down and acknowledge
कि वे केवल 'यंत्र' हैं, , that they are but mere instruments,
और उनके भीतर कार्य करने वाली संचालन शक्ति केवल 'माँ' हैं। , and the supreme power that actually animates them is 'Maa'.
जो दृष्टिगोचर शक्ति है, वही सृष्टि है; , The visible, tangible power is Creation;
और जो शक्ति रूप से भी परे है, वही 'परा-शक्ति' माँ हैं। , and She who rests beyond the form of power is the Para-Shakti, Maa.

जब सभी देवताओं का तेज एक साथ मिला, , When the divine radiance (Tejas) of all the Gods merged into one,
तो वह अकल्पनीय प्रकाश पुंज , that blinding, unfathomable pillar of light
'माँ दुर्गा' के रूप में प्रकट हुआ। , manifested as Maa Durga.
वे ही विष्णु का सुदर्शन चक्र हैं। , She is the razor-sharp Sudarshan of Vishnu.
वे ही महादेव का त्रिशूल हैं। , She is the destructive Trident of Mahadev.
वे ही यमराज का दंड हैं , She is the punishing Staff of Yama
और अग्नि का दहन करने वाला ताप हैं। , and the burning Heat of Agni.
शिव यदि 'शव' (जड़) हैं, , If Shiva is the silent, motionless witness ('Shava' or lifeless),
तो माँ उन्हें 'शिव' (चेतन) बनाने वाली 'शक्ति' (ई-कार) हैं। , She is the untamed dance of life that breathes the 'I' into Him, making Him 'Shiva' (conscious).

वे ही चेतना हैं, , She is Consciousness itself.
वे ही प्रेरणा हैं, , She is Inspiration.
वे ही क्रिया हैं। , She is Action.
वे 'महामाया' हैं जो अपने ही रचे सत्य को छिपाती हैं, , She is 'Mahamaya'—the Great Cosmic Illusionist who flawlessly veils the Truth,
और वे ही 'ब्रह्मविद्या' हैं जो उस सत्य को पुनः प्रकट करती हैं। , and She is 'Brahma-Vidya'—the Ultimate Wisdom that brutally reveals it.
मार्कंडेय पुराण (दुर्गा सप्तशती) में , In the Durga Saptashati,
वे ही वह परम सत्य हैं जो कहती हैं: , She is the Ultimate Truth who declares:
"एकैवाहं जगत्यत्र द्वितीया का ममापरा"— , "Ekai vaham jagatyatra dvitiya ka mamapara"—
इस संसार में मैं अकेली ही हूँ, मेरे सिवा दूसरा कौन है? , I alone exist in this vast world; who else is there besides Me?

माँ बिना रूप के भी हैं (अरूपा) , Maa exists entirely without form (Arupa),
और प्रत्येक रूप में भी (सर्वरूपा)। , and yet She exists within every single form (Sarvarupa).
वे कोमल पुष्प की पंखुड़ी भी हैं , She is the delicate softness of a lotus petal
और वज्र की कठोरता भी। , and the unbreakable hardness of a thunderbolt.
वे ध्यान की असीम शांति भी हैं , She is the deepest, meditative Peace,
और परिवर्तन की प्रलयंकारी अग्नि भी। , and also the cataclysmic, world-ending Fire of Change.
वे क्षमा का अथाह धैर्य हैं , She is bottomless Patience,
और न्याय के निर्णय की तीक्ष्ण धार भी। , and the unforgiving Edge of Decision.

वे 'या देवी सर्वभूतेषु' हैं— , She is the one sung in the verses "Ya Devi Sarvabhuteshu"—
जो हर जीव में क्षुधा (भूख), निद्रा, छाया, शक्ति, , abiding hidden in all beings as hunger, sleep, shadow, power,
और स्मृति के रूप में वास करती हैं। , and memory.
तंत्र शास्त्र की दस महाविद्याएं वही हैं— , She is the Ten Mahavidyas of Tantra—
जो ब्रह्मांड और चेतना के दस गुप्त द्वार खोलती हैं। , the ten great, secret windows of cosmic wisdom.

वे ही महाकाली हैं , She is Mahakali,
जो समय (महाकाल) को भी निगल जाती हैं। , who ruthlessly swallows Time (Mahakaal) itself.
वे ही महालक्ष्मी हैं , She is Mahalakshmi,
जो जगत का भरण-पोषण और ऐश्वर्य हैं। , who nourishes the universe with boundless opulence.
वे ही महासरस्वती हैं , She is Mahasaraswati,
जो अज्ञान के अंधकार को ज्ञान के प्रकाश से मिटाती हैं। , who dispels the suffocating darkness of ignorance with light.
संसार का हर शब्द, हर ध्वनि, हर कंपन— , Every spoken word, every sound, every vibration in existence
माँ का ही अनाहत नाद है। , is Her Anahata Naad (unstruck sound).

माँ दुर्गा के नव रूप: , The Nine Forms of Maa Durga (Navadurga):
शैलपुत्री, ब्रह्मचारिणी, चंद्रघंटा, कूष्मांडा, , Shailaputri, Brahmacharini, Chandraghanta, Kushmanda,
स्कंदमाता, कात्यायनी, कालरात्रि, महागौरी, सिद्धिदात्री— , Skandamata, Katyayani, Kalaratri, Mahagauri, Siddhidatri—
ये चेतना के नौ सोपान हैं। , these are the nine ascending steps of human consciousness.

वे ही 'प्रणव' (ॐ) की आदिशक्ति हैं। , She is the primal, kinetic energy of the 'Pranava' (Om).
अकार, उकार और मकार की ध्वनि में , The consciousness pulsating deep within the sounds of A, U, and M
जो चेतना स्पंदित है, , is Maa.
वही माँ हैं। , In the Saundarya Lahari, it is sung—
सौंदर्य लहरी में शंकराचार्य गाते हैं— , She is Sri Vidya, Tripurasundari,
वे ही श्रीविद्या हैं, त्रिपुरसुंदरी हैं, , the presiding deity of the beauty, consciousness,
जो तीनों लोकों के सौंदर्य, चेतना और आनंद की अधिष्ठात्री हैं। , and supreme bliss of the three worlds.

वे ही श्रीचक्र के मध्य बिंदु (Bindu) में , She is the Supreme Power
विराजमान परम शक्ति हैं, , residing precisely in the center (Bindu) of the Sri Chakra,
जहाँ समस्त ब्रह्मांड की रचना , where the blueprint of the entire cosmos
एक सूक्ष्म, अकल्पनीय बिंदु में समाई हुई है। , is folded and contained within a microscopic dot.
वे ही वेदों की वाणी (वाक) हैं, , She is the sacred voice of the Vedas (Vak),
वे ही उपनिषदों का परम रहस्य हैं, , the deepest secret of the Upanishads,
वे ही ज्ञान की वह पवित्र धारा हैं , and the stream of transcendental knowledge
जो समाधि में बैठे ऋषियों के हृदय में प्रकट होती है। , that manifests inside the hearts of sages in deep Samadhi.

माँ दुर्गा आदिशक्ति का वह प्रकट स्वरूप हैं, , Maa Durga is the fierce, manifest form of Adi-Shakti,
जो धर्म की रक्षा के लिए अस्त्र उठाती हैं। , who raises weapons to protect the cosmic order.
वे अजन्मा हैं, अनादि हैं, अनंत हैं। , She is unborn, beginningless, and endless.
वे सृष्टि की जननी, , She is the Mother of creation,
शक्ति की मूल स्रोत, , the source of all raw power,
और धर्म की रक्षिका (दुर्गातिनाशिनी) हैं। , and the fierce protector of Dharma (Durgatinashini).

वे सर्वज्ञ हैं, , She is omniscient,
सर्वव्यापी हैं, , omnipresent,
और समस्त शक्तियों का मूल आधार हैं। , and the fundamental foundation of all forces.
वे प्रकृति (Prakriti) भी हैं , She is Nature (Prakriti),
और प्रकृति से परे निर्गुण चेतना (Purusha) भी। , and also the absolute Consciousness beyond Nature (Purusha).

जहाँ भी शक्ति, गति, जीवन और सृजन है, , Wherever there is power, motion, life, and creation,
वहाँ माँ की ही उपस्थिति है। , there is the undeniable presence of Maa.
वे पृथ्वी की अपार धैर्यता हैं, , She is the unfailing patience of the earth,
अग्नि की ऊर्जा हैं, , the burning energy of fire,
वायु की तीव्र गति हैं, , the violent speed of the wind,
जल का अबाध प्रवाह हैं , the relentless flow of water,
और आकाश की शून्यता और अनंतता हैं; , and the endless infinity of the sky;
समस्त ब्रह्मांड केवल और केवल उनकी इच्छा-शक्ति से संचालित होता है। , the entire universe is operated solely by Her willpower.

वे सगुण भी हैं, और निर्गुण भी। , She is with attributes, and entirely without attributes.
वे साकार भी हैं, और निराकार भी। , She is with form, and absolutely formless.
वे प्रकृति भी हैं, और परम शक्ति भी। , She is Nature, and the Supreme Power above Nature.
वे जीवन की श्वास भी हैं, और मृत्यु का अंतिम रहस्य भी। , She is the breath of Life, and the dark mystery of Death.
वे सृजन का नाद भी हैं, और संहार का मौन भी। , She is the sound of Creation, and the silence of Destruction.
वे ज्ञान भी हैं, और अज्ञान (अविद्या) को मिटाने वाली भी। , She is Knowledge, and the fierce destroyer of ignorance.
वे प्रकाश भी हैं, और ब्रह्मांडीय अंधकार को भेदने वाली भी। , She is Light, and the one who pierces the cosmic darkness.

“दुर्गा” शब्द का अर्थ है , The word "Durga" means
जो सभी कठिनाइयों (दुर्ग) का नाश करती है; , the one who destroys all insurmountable difficulties (Durg);
इसलिए उन्हें दुःख नाशिनी, , hence She is hailed as the destroyer of sorrow,
दुष्ट विनाशिनी , the annihilator of the wicked,
और भय हरिणी कहा जाता है। , and the remover of all mortal fear.

माँ दुर्गा का दिव्य स्वरूप , The divine form of Maa Durga
अत्यंत शक्तिशाली और साथ ही वात्सल्यमयी है। , is infinitely powerful and yet fiercely compassionate.
वे सिंह या बाघ पर आरूढ़ होती हैं (प्रकृति पर नियंत्रण), , She rides a lion or a tiger (mastery over animalistic nature),
उनके अठारह या दस भुजाएँ होती हैं, , possesses eighteen or ten arms,
और प्रत्येक हाथ में एक दिव्य अस्त्र होता है , and holds a divine weapon in each hand,
जो देवताओं की शक्तियों का प्रतीक हैं: , symbolizing the consolidated powers of the gods:
त्रिशूल (तीनों गुणों—सत्व, रज, तम का नियंत्रण), , the Trident (control over the three Gunas),
चक्र (समय के पहिए और धर्म की रक्षा), , the Discus (protection of time and Dharma),
खड्ग (अज्ञान के पर्दे का विनाश), , the Sword (the blade that severs the veil of ignorance),
और धनुष-बाण (मन की एकाग्रता और न्याय)। , and the Bow and Arrow (one-pointed focus and justice).

माँ दुर्गा का सबसे प्रसिद्ध स्वरूप 'महिषासुर मर्दिनी' है। , Her most famous form is Mahishasura Mardini.
जब अहंकार रूपी असुर महिषासुर ने देवताओं (सद्गुणों) को पराजित कर दिया, , When the buffalo-demon Mahishasura (symbolizing stubborn ego) defeated the gods,
तब सभी देवताओं की शक्तियों से , a divine, invincible power was born
एक दिव्य, अजेय शक्ति उत्पन्न हुई—माँ दुर्गा। , from the combined, desperate energies of all deities—Maa Durga.
उन्होंने महिषासुर का वध करके ब्रह्मांड में धर्म की रक्षा की। , She protected Dharma by violently slaying Mahishasura.
यह कथा चीख-चीख कर यह बताती है कि , This ancient story signifies that
अहंकार चाहे कितना भी शक्तिशाली और मायावी क्यों न हो, , no matter how powerful, deceptive, or inflated the human ego may be,
अंततः परम शक्ति द्वारा उसका सर्वनाश निश्चित है। , it is ultimately, inevitably destroyed by Her divine power.

माँ दुर्गा केवल मंदिरों में पूजी जाने वाली कोई बाहरी देवी नहीं हैं; , Maa Durga is not merely an external Goddess worshipped in temples;
वे प्रत्येक जीव के मूलाधार में स्थित शक्ति हैं। , She is the latent power situated at the base of every living spine.
योग और तंत्र में , In the ancient sciences of Yoga and Tantra,
इस सुप्त शक्ति को 'कुंडलिनी' कहा गया है। , this coiled power is called Kundalini.
जब यह कुंडल मारे बैठी शक्ति (सर्पिणी) जागृत होती है, , When this sleeping serpent awakens,
तब वह रीढ़ की हड्डी (सुषुम्ना) से होती हुई सहस्रार तक जाती है। , it pierces through the chakras to reach the crown (Sahasrara).
तब चेतना सर्वोच्च शिखर पर पहुँचती है, , There, consciousness is elevated to its absolute peak,
सारे रहस्य खुल जाते हैं, , all cosmic secrets are revealed,
और जीव शिव से मिलकर मोक्ष को प्राप्त होता है। , and the soul merges with Shiva, attaining ultimate liberation (Moksha).

वे ही महाकाल की जननी हैं— , She is the Mother of Time—
समय उनके ही भीतर जन्म लेता है , time is literally born within Her womb,
और एक कल्प के बाद उन्हीं में वापस विलीन हो जाता है। , and at the end of a Kalpa, merges back into Her.
वे ही सृष्टि का वह महा-गर्भ (Hiranyagarbha) हैं, , She is the cosmic womb of creation (Hiranyagarbha),
जहाँ से हर जीव, हर विचार , from which every being, every thought,
और हर नया ब्रह्मांड उत्पन्न होता है। , and every new universe originates.

वे करुणा का असीम सागर हैं। , She is the bottomless ocean of compassion.
अपराध चाहे कितना भी बड़ा और अक्षम्य क्यों न हो, , No matter how grave, unforgivable, or dark the sin,
माँ की शरण में रोते हुए आने वाले को वे अपने आंचल में छिपा लेती हैं। , She hides the weeping devotee who seeks refuge within Her embrace.
वे ही भक्ति हैं, , She is devotion,
वे ही श्रद्धा हैं, , She is unwavering faith,
वे ही हर तपस्वी की साधना की शक्ति हैं। , She is the unseen power behind every ascetic's spiritual practice (Sadhana).

जहाँ भी सत्य के लिए खड़ा होने का साहस है, वहाँ माँ हैं। , Wherever there is the courage to stand for truth, there is Maa.
जहाँ भी निःस्वार्थ करुणा है, वहाँ माँ हैं। , Wherever there is selfless compassion, there is Maa.
जहाँ भी निर्बलों की रक्षा की भावना है, वहाँ साक्षात माँ दुर्गा हैं। , Wherever there is a fierce desire to protect the weak, there is Maa Durga.
वे ही जगतजननी हैं— , She is Jagatjanani—the Mother of the Universe,
यह समस्त ब्रह्मांड जिनकी एक छोटी सी संतान है। , whose children are the stars and the galaxies.

और अंततः, , And ultimately,
जब महाप्रलय में सृष्टि का समस्त कोलाहल शांत हो जाता है, , when the deafening uproar of creation is silenced in the Mahapralaya,
जब सूर्य, चंद्र और तारे बुझ जाते हैं, , when the sun, the moon, and the stars burn out,
जब समय स्वयं थक कर विश्राम में चला जाता है, , when time itself grows exhausted and goes to rest,
तब उस असीम शून्यता में जो शाश्वत शांति शेष रहती है— , the eternal, unfathomable peace that remains in the void...
वही माँ हैं। , is Maa.

ज़रा एक पल ठहर कर, श्वास को रोक कर सोचिए, , Pause for a moment, hold your breath, and deeply ponder this:
जो विचार अभी-अभी आपके मन में एक बुलबुले की तरह उठा, , the thought that just seamlessly arose like a bubble in your mind,
वह वास्तव में किसका था? , whose was it, really?
क्या आप सचमुच उस विचार के विचारक हैं, , Are you truly the author of your thoughts,
या माँ की ही अदम्य, स्वतंत्र ऊर्जा , or is it Her untamed, sovereign energy
आपके मन रूपी बर्तन में अपने ही विचार उत्पन्न कर रही है? , thinking its own thoughts using the hollow vessel of your mind?

वे वह अदृश्य, तांत्रिक धागा हैं , She is the invisible, tantric thread
जो इस ब्रह्मांड की हर उठती हुई श्वास, , seamlessly stitching together every single rising breath,
हर जलते हुए सूर्य , every burning sun,
और हर मरते हुए परमाणु को , and every decaying atom
एक ही माला में पिरोए हुए है। , of this vast cosmos.

जिसे हम खाली आकाश कहते हैं, , What we perceive as empty space
वह खाली नहीं है—वह माँ का असीमित आलिंगन है, , is not empty at all—it is Her invisible cosmic embrace,
जो पूरे ब्रह्मांड को बिखरने से रोके हुए है। , fiercely holding the galaxies apart yet binding them together.
जब आप करुणा से रोते हैं, तो वह आपके आँसुओं का जल हैं; , When you weep, She is the water of your tears;
जब आप क्रोधित होते हैं, तो वह आपकी धधकती अग्नि हैं। , when you rage, She is the fuel of your blazing fire.

उनकी 'महामाया' का आवरण इतना घना, इतना पारदर्शी और इतना निर्दोष है , The veil of Her 'Mahamaya' is so flawlessly, meticulously, and perfectly woven
कि वह आपको यह पूरा, सौ प्रतिशत भ्रम दिलाती है , that it grants you the absolute, 100% illusion
कि आप एक 'स्वतंत्र' जीव हैं, , of being an 'independent' entity
जो अपने निर्णय स्वयं ले रहा है। , making your own free choices.
लेकिन क्या यह सत्य है? , But is it the truth?

क्या एक मकड़ी कभी , Can a spider ever
अपने ही शरीर से बुने हुए जाले से , be truly separate from the very web
अलग अस्तित्व रख सकती है? , it spun out of its own body?
क्या एक लहर कभी समुद्र से यह कह सकती है कि वह स्वतंत्र है? , Can a wave ever turn to the ocean and claim it is independent?
माँ वह ब्रह्मांडीय पहेली हैं , She is the ultimate cosmic riddle
जिसका कोई भी उत्तर नहीं है, , with absolutely no answer,
क्योंकि उत्तर खोजने वाली वह बेचैन बुद्धि भी वे स्वयं ही हैं। , simply because the restless intellect desperately seeking the answer is also Her.

जिस दिन वेदांत और तंत्र के प्रभाव से अज्ञान का यह भ्रम टूटता है, , The exact day this grand illusion shatters through the lens of Vedanta,
तब गहराई से, बहुत गहराई से यह ज्ञात होता है , you will finally, deeply realize
कि न कोई जन्म था, , there was never a birth,
न कोई मृत्यु थी— , nor was there ever a death—
केवल एक महा-ऊर्जा थी, , only one Supreme, Divine Energy
जो अपने ही रचे हुए इस मायावी नाटक में, , playing an eternal, masterful game of hide-and-seek,
स्वयं को भूलने , intentionally forgetting
और युगों बाद फिर से पहचानने का , and then beautifully remembering Herself
एक अत्यंत अद्भुत और रहस्यमयी अभिनय कर रही थी। , through the eyes of a billion living creatures.

विष्णु कौन हैं? — , Who is Vishnu? —
वे "विराट" और "सूक्ष्म" दोनों हैं। , He is both the 'Macroscopic' (Virat) and the 'Microscopic' (Sukshma).
भगवान विष्णु सृष्टि के परम पालनकर्ता हैं। , Lord Vishnu is the supreme preserver of creation.
वे धर्म की अटल रक्षा, ब्रह्मांडीय संतुलन , He fiercely protects Dharma, maintains the cosmic balance,
और सृष्टि की अलौकिक व्यवस्था को बनाए रखते हैं। , and upholds the eternal divine order of the universe.

विष्णु परम सत्य हैं। , Vishnu is the Absolute Truth.
'विष्' धातु से बने इस नाम का अर्थ है— , The holy name, derived from the Sanskrit root 'Vish',
"जो सर्वत्र व्याप्त है।" , translates to "The All-Pervading One."
जैसे कुम्हार, मिट्टी और घड़ा अलग-अलग दिखते हैं , Just as the potter, the spinning wheel, the clay, and the pot appear to be entirely different
पर वास्तव में वे सब मिट्टी ही हैं, , but are essentially just clay,
वैसे ही कारण, कार्य और कर्ता , similarly, the cause, the effect, and the doer
सब विष्णु ही हैं। , are all flawlessly Vishnu.

ऋग्वेद के 'पुरुष सूक्त' में, , In the mystical 'Purusha Suktam' of the Rigveda,
वे ही वह सहस्र-शीर्षा (हजारों सिरों वाले) विराट पुरुष हैं, , He is described as the thousand-headed Cosmic Being (Virat Purusha),
जिनके हजारों नेत्र और हजारों चरण हैं। , possessing a thousand eyes and a thousand feet.
उन्होंने इस पूरी पृथ्वी और ब्रह्मांड को हर ओर से घेर रखा है, , He completely envelops the entire earth and the cosmos from all sides,
और फिर भी वे दस अंगुल उससे परे (पार) स्थित हैं। , and yet, He transcends it by the width of ten fingers.
जो कुछ अतीत में था, जो वर्तमान में है, , Whatever existed in the ancient past, whatever breathes in the present,
और जो भविष्य में होगा—वह सब केवल यही 'पुरुष' है। , and whatever will manifest in the future—is nothing but this 'Purusha'.

वे वही अदृश्य सूत्र (धागा) हैं , He is the invisible cosmic thread
जिसमें यह सम्पूर्ण ब्रह्मांड , upon which this entire, staggeringly vast universe
मणियों की तरह पिरोया हुआ है। , is beautifully strung like glowing pearls.
वे वह आधार हैं , He is the ultimate Foundation
जिस पर इस जगत का स्वप्न देखा जा रहा है। , upon which the vivid dream of the universe is currently playing out.
हिन्दू दर्शन की त्रिमूर्ति में , In the sacred Hindu Trinity,
ब्रह्मा यदि सृष्टि हैं और शिव यदि संहार हैं, , if Brahma represents creation and Shiva embodies destruction,
तो विष्णु वह 'परम पालन' हैं , Vishnu is the 'Supreme Preservation'
जो इन दोनों के असीम बल के बीच संतुलन स्थापित करते हैं। , that establishes a flawless equilibrium between those two infinite forces.

वे ही 'नारायण' हैं— , He is 'Narayana'—
'नार' अर्थात् जीव और जल (चेतना), , 'Nara' meaning water and living beings (consciousness),
और 'आयन' अर्थात् आश्रय। , and 'Ayana' meaning the ultimate resting place.
समस्त जीवों का अंतिम आश्रय, , The absolute refuge of all living entities;
समस्त प्राणी जिनमें उत्पन्न होते हैं, , the One from whom all creatures are miraculously born,
जिनमें स्थित रहते हैं, , the One in whom they sustain their existence,
और जिनमें अंततः लीन हो जाते हैं— , and the One into whom they ultimately merge at the end of time—
वही नारायण हैं। , that is Narayana.

'नारायण सूक्त' यह उद्घोष करता है: , The 'Narayana Suktam' boldly declares:
"यच्च किञ्चिज्जगत्यस्मिन् दृश्यते श्रूयतेऽपि वा।" , "Yaccha kinchit jagatyasmin drishyate shruyatepi va."
अर्थात्, इस जगत में जो कुछ भी देखा या सुना जाता है, , Meaning, whatever is seen or heard in this entire universe,
नारायण उसके भीतर और बाहर, , Narayana flawlessly pervades it all,
सर्वत्र और पूरी तरह से व्याप्त हैं। , from both the inside and the outside.

श्रीमद्भागवत पुराण के अनुसार, , According to the esoteric cosmology of the Srimad Bhagavatam,
वे महाविष्णु (कारणोदकशायी विष्णु) के रूप में , He rests in the dark Causal Ocean (Karana Ocean)
कारण-सागर (Causal Ocean) में शयन करते हैं। , as Maha-Vishnu.
जब वे श्वास बाहर छोड़ते हैं, , With every single exhalation of His divine breath,
तो उनके रोम-कूपों से अनंत ब्रह्मांड उत्पन्न होते हैं; , billions of magnificent universes bubble out from the pores of His skin;
और जब वे श्वास भीतर खींचते हैं, , and with every single inhalation,
तो वे सारे ब्रह्मांड पुनः उनके भीतर विलीन हो जाते हैं। , all those universes are violently sucked back into His absolute void.
सोचिए, हमारा यह विशाल ब्रह्मांड , Imagine—our entire, incomprehensibly vast universe
उनके एक श्वास के अंश मात्र से अधिक कुछ नहीं है। , is nothing more than a microscopic fraction of His single breath.

वे क्षीरसागर (अनंत चेतना के महासागर) में , He reclines majestically upon Ananta Shesha
अनंत शेषनाग (काल की अनंतता) पर , in the vast Ocean of Milk (the ocean of infinite consciousness).
शयन करते हैं (योगनिद्रा)। , This state is His 'Yoga Nidra' (the divine, cosmic sleep).
अविनाशी, निर्गुण, अच्युत (जो कभी च्युत न हो)। , He is imperishable, completely attribute-less, and Achyuta (the Infallible One).
वे सभी कालों के मौन साक्षी हैं। , He is the silent, motionless witness of all ages and epochs.
वे परम स्वप्नदृष्टा हैं— , He is the Great Dreamer—
यह पूरा जगत् और इसका सारा प्रपंच , and this entire physical world, with all its complexities,
उनकी 'योगनिद्रा' का ही एक जादुई विस्तार है। , is merely a magical projection born from His 'Yoga Nidra'.

कठोपनिषद में एक अद्भुत रहस्य है: , The Katha Upanishad reveals a staggering secret:
मनुष्य का शरीर एक रथ है, , The human body is merely a chariot,
इंद्रियां उस रथ के घोड़े हैं, , the senses are the wild, untamed horses,
मन उन घोड़ों की लगाम है, , the mind is the reins holding them,
और आत्मा उस रथ का रथी (सवार) है। , and the eternal Soul (Atman) is the passenger.
इस पूरी यात्रा का अंतिम और सर्वोच्च लक्ष्य क्या है? , And what is the ultimate, final destination of this perilous journey?
"तद्विष्णोः परमं पदम्"— , "Tad Vishnoh Paramam Padam"—
विष्णु का वह परम पद, वह सर्वोच्च धाम, , The Supreme Abode of Vishnu,
जहाँ पहुँचकर आत्मा फिर कभी लौटकर नहीं आती। , reaching which, the soul never returns to the cycle of illusions.

वे जीवन और मृत्यु के बीच का अजेय सेतु हैं। , He is the unbreakable bridge between life and death.
गरुड़ पुराण में उन्हें धर्म का रक्षक, , The Garuda Purana describes Him as the fierce protector of Dharma,
जीवों का परम मार्गदर्शक , the ultimate guide of living beings,
और मृत्यु के बाद आत्मा के पथ का ज्ञाता बताया गया है। , and the absolute Knower of the soul's dark path after death.
मृत्यु के पार उस घोर अंधकार में जब आत्मा बिल्कुल अकेली होती है, , When the soul crosses the threshold of mortality and journeys utterly alone,
तब केवल नारायण का नाम ही , the holy name of Narayana
उसका एकमात्र रक्षक , is its only true companion
और परम 'गति' होता है। , and its final, supreme destination.

जल में रस वही हैं, , He is the sweet taste in the water,
सूर्य और चंद्र में चमकता प्रकाश वही हैं। , the blinding brilliance in the sun and the moon.
वेदों में पवित्र प्रणव (ॐ) वही हैं, , He is the sacred Pranava (Om) vibrating in the Vedas,
आकाश में गूंजता शब्द वही हैं। , the primordial sound echoing in the ether.
वे सृष्टि के प्रारंभिक और सनातन बीज हैं। , He is the original, eternal seed of all existences.
बुद्धिमानों की प्रखर बुद्धि, , He is the sharp intelligence of the intelligent,
तेजस्वियों का प्रखर तेज, , the radiant splendor of the splendid,
बलवानों का निष्काम बल , the selfless, unshakeable strength of the strong,
और तपस्वियों का अघोर तप वही हैं। , and the fierce penance of the silent ascetics.

बाणों की शय्या पर लेटे हुए भीष्म पितामह भी , Even the grand patriarch Bhishma, bleeding on a bed of arrows,
हाथ जोड़कर उन्हें 'पुरुषोत्तम' पुकारते हैं। , folds his hands and hails Him as 'Purushottama' (The Supreme Being).
"यतो कृष्ण ततो धर्म"— , "Yato Krishna Tato Dharma"—
जहाँ विष्णु (कृष्ण) हैं, वहीं साक्षात धर्म है, , Wherever there is Vishnu (Krishna), there is absolute Dharma;
और जहाँ धर्म है, वहीं सुनिश्चित विजय है। , and wherever there is Dharma, there is inevitable Victory.
वे 'विग्रहवान धर्म' (धर्म के साकार रूप) हैं। , He is "Vigrahavaan Dharmah"—the very personification of Righteousness.
वे मर्यादा हैं, वे ही सत्य की सर्वोच्च कसौटी हैं। , He is the strict boundary (Maryada) of cosmic conduct and the ultimate test of Truth.

गीता में कृष्ण उद्घोष करते हैं: , In the Bhagavad Gita, Krishna compassionately declares:
"सुहृदं सर्वभूतानाम्"— , "Suhridam sarva-bhutanam"—
वे सभी प्राणियों के सुहृद (निस्वार्थ और परम मित्र) हैं। , He is the selfless, unconditional friend (Suhrid) of all beings.
जो उन्हें श्रद्धा से भजते हैं— , Those who worship Him with unyielding devotion—
वे उनमें स्थित हैं, , He permanently resides within their hearts,
और विष्णु उन भक्तों के हृदय में स्थित रहते हैं। , and they reside safely within Him.

वे 'अंतर्यामी' हैं— , He is the 'Antaryami'—
जो आपके श्वास लेने से पहले ही जानते हैं , the Inner Controller who knows the darkest thoughts
कि आपके मन के सबसे अंधेरे कोने में क्या विचार जन्म ले रहा है। , forming in your mind even before you take your next breath.
वे ही कहते हैं: , He declares with absolute authority:
“अहमात्मा गुडाकेश सर्वभूताशयस्थितः”— , "Aham atma gudakesha sarva-bhutashaya-sthitah"—
मैं सभी प्राणियों के हृदय में स्थित आत्मा हूँ; , I am the Supersoul seated deep within the hearts of all living entities;
मैं ही उनका आदि, उनका मध्य , I am the beginning, the middle,
और उनका अंत हूँ। , and the absolute end of all beings.

आदित्यों में वे विष्णु हैं, मरुतों में मरीचि। , Among Adityas, He is Vishnu; among Maruts, Marichi.
ज्योतियों में देदीप्यमान सूर्य हैं, नक्षत्रों में चंद्र। , Among luminaries, the radiant Sun; among stars, the Moon.
वेदों में सामवेद हैं, देवों में इंद्र। , Among the Vedas, the Samaveda; among gods, Indra.
इंद्रियों में वे मन हैं। , Among the senses, He is the Mind.
रुद्रों में शंकर (महादेव) हैं। , Among Rudras, Shankara (Mahadev).
यक्ष-रक्षों में कुबेर हैं, वसुओं में अग्नि हैं। , Among Yakshas and Rakshasas, Kubera; among Vasus, Agni.
पर्वतों में सुमेरु हैं, पुरोहितों में बृहस्पति हैं। , Among mountains, Mount Meru; among priests, Brihaspati.
महर्षियों में भृगु हैं, वाणी में ॐकार हैं। , Among great sages, Bhrigu; among speech, the eternal Omkara.
यज्ञों में वे जप-यज्ञ हैं। , Among sacrifices, the silent chanting of Japa-yajna.
वृक्षों में अश्वत्थ (पीपल) हैं, देवर्षियों में नारद हैं। , Among trees, the sacred Peepal; among divine sages, Narada.
सिद्धों में कपिल मुनि हैं। , Among perfected beings, Kapila Muni.
शस्त्रधारियों में राम हैं, , Among wielders of weapons, Lord Rama;
यदुवंशियों में कृष्ण हैं, , among the Yadavas, Krishna;
और अक्षरों में 'अकार' (अ) हैं। , and among all letters, the primary letter 'A'.

विष्णु के चार हाथ हैं, , Vishnu possesses four magnificent arms, holding:
जिनमें शंख (पाञ्चजन्य—धर्म का नाद), , The Conch (Panchajanya—the roaring sound of cosmic Dharma),
चक्र (सुदर्शन—समय और अजेय न्याय), , The Discus (Sudarshana—the unstoppable wheel of time and justice),
गदा (कौमोदकी—असीम शक्ति) , The Mace (Kaumodaki—supreme, crushing power),
और पद्म (कमल—परम पवित्रता) सुशोभित है। , and The Lotus (Padma—absolute purity amidst the mud of existence).
उनका वाहन गरुड़ है— , His vehicle is the mighty eagle Garuda—
जो वेदों की ऋचाओं का साकार रूप है, , the personification of the Vedic hymns,
और आकाश की अनंत स्वतंत्रता का प्रतीक है। , symbolizing brilliance, extreme courage, and the absolute freedom of the skies.

धर्म की रक्षा और ब्रह्मांडीय संतुलन बनाए रखने के लिए , To protect Dharma and relentlessly maintain the cosmic balance,
विष्णु समय-समय पर माया का आवरण ओढ़कर अवतार लेते हैं। , Vishnu wraps Himself in the cloak of Maya and incarnates age after age.
"यदा यदा हि धर्मस्य ग्लानिर्भवति भारत..." , "Yada yada hi dharmasya glanirbhavati bharata..."
वे मत्स्य हैं, जो प्रलय के भयंकर जल से वेद-ज्ञान को बचाते हैं। , He is Matsya, the great fish who saves Vedic wisdom from the apocalyptic deluge.
वे कूर्म हैं, जो अपनी पीठ पर मंदराचल और सृष्टि का भार संभालते हैं। , He is Kurma, the giant tortoise bearing the crushing weight of creation on His back.
वे वराह हैं, जो पाताल के अंधकार से पृथ्वी को अपने दांतों पर उठा लाते हैं। , He is Varaha, the fierce boar lifting the drowning earth from the dark abyss.
वे नरसिंह हैं, जो स्तंभ फाड़कर अधर्म का सीना चीर देते हैं। , He is Narasimha, the terrifying half-man, half-lion who tears open the chest of Adharma.
वे वामन हैं, जो केवल तीन पग में ब्रह्मांड नापकर अहंकार को कुचल देते हैं। , He is Vamana, the dwarf who crushes cosmic arrogance in just three strides.
वे परशुराम हैं, जो शक्ति के क्रूर मद का विनाश करते हैं। , He is Parashurama, the warrior-sage who annihilates the intoxication of absolute power.
वे राम हैं, जो धर्म और मर्यादा के सर्वोच्च आदर्श हैं। , He is Rama, the perfect embodiment of righteousness and moral boundaries (Maryada).
वे कृष्ण हैं, जो प्रेम, कूटनीति, ज्ञान और अनंत लीला हैं। , He is Krishna, the master of love, diplomacy, cosmic wisdom, and divine play (Leela).
वे बुद्ध हैं, जो ध्यान हैं, , He is Buddha, the silence of meditation,
और वे ही कल्कि हैं, जो युग का अंतिम संहारक प्रकाश होंगे। , and He is Kalki, the blazing, apocalyptic light that will end the dark age.

उनके 'विश्वरूप' में हजारों सूर्यों का अंधा कर देने वाला तेज है। , His 'Vishvarupa' (Universal Form) blazes with the blinding intensity of a thousand suns.
कुरुक्षेत्र में जब अर्जुन ने वह रूप देखा, , When Arjuna witnessed this terrifying form on the battlefield,
तो उसमें समय, देवता, ग्रह, तारे, असुर , time, gods, planets, stars, demons,
और सम्पूर्ण ब्रह्मांड की चेतना , and the consciousness of the entire universe
एक ही शरीर में भयंकर वेग से घूम रही थी। , were spinning violently within a single, magnificent body.
उसी महा-रूप से वे अर्जुन से कहते हैं: , From that overwhelming form, He commands Arjuna:
"सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज"— , "Sarva-dharman parityajya mamekam sharanam vraja"—
सारे धर्मों और कर्मों का मोह त्याग कर केवल मेरी शरण में आ जा, , Abandon all varieties of religion, duties, and attachments, and simply surrender unto Me alone;
मैं तुझे सभी पापों से मुक्त कर दूँगा, तू शोक मत कर। , do not fear, for I shall deliver you from all sins.

वे कभी न समाप्त होने वाला समय (महाकाल) भी हैं, , He is inexhaustible, all-devouring Time (Mahakala).
सर्वभक्षी मृत्यु भी वही हैं— , He is Death itself—
और मृत्यु को हराने वाला अमृत भी वही हैं। , and He is also the ultimate Victory over death (Amrit).
उत्पत्ति का कोई भी बीज—चर हो या अचर— , No seed of creation—whether moving or unmoving—
उनके बिना पनप ही नहीं सकता। , can ever exist without Him.
वे प्राणों के प्राण हैं, जीवों के जीव हैं। , He is the Breath of breaths, the Life of lives.
सम्पूर्ण भूतों में वे स्थित हैं— , He completely pervades all beings—
और वे स्वयं सम्पूर्ण भूतों के भीतर हैं। , and He exists simultaneously within all beings.

अब ज़रा इस माया के पर्दे को हटाकर एक बहुत गहरे सत्य पर विचार करें: , Now, pull back the heavy curtain of Maya and ponder a terrifyingly deep truth:
क्या यह पूरा ब्रह्मांड, इसके सारे युद्ध, प्रेम और इतिहास, , Is it entirely possible that this grand, complex universe, with all its brutal wars, epic loves, and long histories,
केवल भगवान विष्णु का एक अनंत, सम्मोहक स्वप्न है? , is merely a fleeting, mesmerizing dream in the mind of Lord Vishnu?
सोचिए, , Think deeply about it—
यदि वे अपनी उस दिव्य योगनिद्रा से अचानक एक पल के लिए जाग गए, , what happens to your existence, and to all of us,
तो आपका, मेरा और इस पूरी दुनिया का अस्तित्व कहाँ जाएगा? , if He suddenly wakes up from His cosmic Yoganidra for just one second?

शायद हम सब , Perhaps we are all miraculously born
उनके एक ही श्वास के भीतर जन्म लेते हैं, , within a single, massive inhalation of His divine breath,
अपने जीवन का पूरा नाटक खेलते हैं, , we violently play out our entire lives and histories,
और उसी श्वास के बाहर निकलते ही , and we dissolve completely into absolute nothingness
शून्यता में हमेशा के लिए विलीन हो जाते हैं। , the exact moment He exhales.
जो समय हमें सदियों का लंबा और भारी इतिहास लगता है, , What feels like long, exhausting centuries of human evolution to us
वह श्री हरि की पलक झपकने का , is merely a microscopic, unnoticed fraction
एक अत्यंत अदृश्य और छोटा सा अंश मात्र है। , of a blink of Sri Hari's eyes.

क्या आप वास्तव में अपने जीवन के कर्ता हैं? , Are you truly the autonomous, independent doer of your life's actions?
क्या आपकी इच्छाएं सचमुच आपकी हैं? , Are your desires actually your own?
या आप केवल उस महा-नाटक के एक बहुत छोटे से पात्र हैं , Or are you just a temporary, scripted character playing a pre-assigned role in a grand cosmic play
जिसकी पूरी पटकथा , whose complete script
सृष्टि की शुरुआत से बहुत पहले ही , was already written aeons ago
क्षीरसागर की अथाह गहराइयों में लिखी जा चुकी है? , in the silent depths of the Ocean of Milk?

जिस 'मैं' (अहंकार) को आप अपना ठोस और अमिट अस्तित्व मानते हैं, , The 'I' (Ego) that you so fiercely defend as your solid existence
वह तो केवल उस परमात्मा के असीमित समुद्र की , is merely a momentary, fragile wave
एक नन्ही सी लहर है, , on the infinite ocean of the Supreme.
जो पल भर के लिए आकार लेती है, 'मैं' होने का दावा करती है, , It proudly rises for a fraction of a second, claims to be an individual,
और फिर टूटकर उसी मूल स्रोत में वापस खो जाती है। , and then violently crashes back, losing itself entirely in its infinite source.

माया का चक्रव्यूह इतना गहरा और इतना वास्तविक है , The labyrinth of Maya is so perfectly and flawlessly designed
कि हम उस दिव्य नाविक (विष्णु) को पूरी तरह भूलकर, , that we completely forget the Divine Boatman (Vishnu),
इस डूबती हुई लकड़ी की नाव (शरीर) को ही , and tragically mistake this sinking, decaying wooden boat (the body)
अपना शाश्वत घर मान बैठते हैं। , for our permanent, eternal home.

जब आप अपने ही मन की अंतिम गहराई में उतरेंगे, , If you dare to dive deep enough into your own consciousness,
जहाँ सारे विचार और सारी पहचान मर जाती है, , stripping away all thoughts, labels, and memories,
तो आप पाएंगे कि आपके भीतर बहुत चुपचाप बैठा , you will suddenly realize that the nameless 'Antaryami' (Inner Controller)
वह अनाम 'अंतर्यामी' ही वास्तविक आप हैं। , sitting quietly in the pitch dark within you is the only real 'You'.
हम सब एक ही महा-स्वप्न के , We are all just fragmented, vividly colored pieces
अलग-अलग रंगीन हिस्से हैं। , of a single, colossal dream.

जब अंततः यह स्वप्न टूटेगा, , When this cosmic dream finally shatters at the end of time,
तो न कोई ब्रह्मांड होगा, , there will be no physical world left,
न कोई 'तुम' होगे और न कोई 'मैं' रहूँगा— , there will be no 'You', and there will be no 'I'—
वहाँ केवल एक अनंत, , only an infinite,
अथाह, , fathomless,
शांत , silent,
और असीम नारायण ही शेष होंगे। , and boundless Narayana will remain.

लक्ष्मी कौन हैं? — , Who is Lakshmi? —
वे केवल 'धन' नहीं, , She is not merely 'Wealth',
वे 'श्री' (ब्रह्मांडीय वैभव) हैं। , She is 'Shri' (The Ultimate Divine Splendor).
माँ लक्ष्मी परम समृद्धि, सौभाग्य, ऐश्वर्य , Maa Lakshmi is the supreme Goddess of prosperity, fortune, cosmic opulence,
और सृष्टि के सर्वोच्च संतुलन की देवी हैं। , and absolute balance.

वे केवल क्षुद्र भौतिक धन की देवी नहीं हैं; , She is not merely the shallow Goddess of material wealth;
वे जीवन में पूर्णता, संतुलन, समृद्धि , She represents the deep, primal energy of balance, prosperity,
और शुभता की आदि-ऊर्जा का प्रतिनिधित्व करती हैं। , and the highest auspiciousness in life.
'श्री' केवल मुद्राओं का ढेर नहीं है— , 'Shri' is not just a collection of gold coins—
वह अंतहीन सौंदर्य है, , it is breathtaking beauty,
परम संतुलन है, , perfect cosmic balance,
अखंड मंगल है, , unbroken auspiciousness,
और जीवन की समृद्धि का वह दिव्य प्रवाह है , and the divine, never-ending flow of life's true prosperity
जो कभी सूखता नहीं। , that never runs dry.

नारायण यदि प्रखर सूर्य हैं, , If Lord Narayana is the blazing Sun,
तो लक्ष्मी उनका वह तेज (प्रकाश) हैं , Lakshmi is His brilliant Radiance
जिससे पूरी सृष्टि प्रकाशित होती है; , that illuminates creation;
सूर्य और उसका प्रकाश कभी एक दूसरे से अलग नहीं हो सकते। , the Sun and its Light can never be separated from each other.
नारायण यदि 'धर्म' की अचल स्थापना हैं, , If Narayana is the immovable foundation of 'Dharma' (Righteousness),
तो लक्ष्मी वह 'समृद्धि' हैं जो परछाई की तरह धर्म के पीछे चलती हैं। , Lakshmi is the 'Prosperity' that flawlessly follows Dharma like a shadow.
विष्णु यदि सृष्टि के 'पालनहार' हैं, , Vishnu is the ultimate 'Preserver' of the universe,
तो लक्ष्मी वह अनंत 'संसाधन' (पोषण) हैं , and Lakshmi is the infinite 'Resource' (nourishment)
जिससे वह पालन किसी भी युग में संभव होता है। , that makes His preservation possible across all ages.
वे वह परम पूर्णता हैं जो ब्रह्मांड के हर अभाव को मिटाती हैं। , She is the absolute 'Fullness' that eradicates every lack in the cosmos.

“लक्ष्मी” शब्द संस्कृत के “लक्ष” से बना है, , The Sanskrit word "Lakshmi" is derived from the root "Laksh",
जिसका अर्थ है—लक्ष्य, चिह्न, और शुभ संकेत; , which translates to target, sign, or an auspicious symbol;
अर्थात् जो इस भटकते हुए जीवन को परम उद्देश्य, , meaning She is the one who provides ultimate purpose,
सौभाग्य और समृद्धि प्रदान करती हैं। , fortune, and meaningful prosperity to a wandering life.

ऋग्वेद के 'श्री सूक्त' में , In the sacred 'Sri Suktam' of the Rigveda,
उन्हें 'हिरण्यवर्णां' (सोने के समान कांति वाली) , She is glorified as 'Hiranyavarnam' (the one with a golden complexion)
और 'सुवर्णरजतस्रजाम्' (स्वर्ण और रजत की माला धारण करने वाली) कहा गया है। , and 'Suvarnarajatastrajam' (the one adorned with garlands of gold and silver).
वे अग्नि के समान तेजस्विनी , She is as radiant as the fire
और सूर्य की भांति प्रज्वलित हैं। , and as blazing as the sun.
ऋषियों ने पुकार कर कहा: , The ancient sages loudly invoked Her, chanting:
"तां म आवह जातवेदो लक्ष्मीमनपगामिनीम्"— , "Tam ma avaha Jatavedo Lakshmimanapagaminim"—
हे अग्निदेव! उस लक्ष्मी को मेरे लिए आवाहन करें, , O Agni! Invoke for me that Goddess Lakshmi
जो कभी नष्ट न हो, जो कभी मुझे छोड़कर न जाए। , who is eternal, and who will never, ever abandon me.

विष्णु पुराण के अनुसार माँ लक्ष्मी का प्राकट्य , According to the Vishnu Purana, Maa Lakshmi manifested
अमृत की खोज में हुए 'समुद्र मंथन' से हुआ। , from the legendary Samudra Manthan (the churning of the cosmic ocean).
जब देव और असुरों ने वासुकि नाग की डोरी बनाकर , When the gods and demons desperately churned the Ocean of Milk
मंदराचल पर्वत से क्षीरसागर को मथा, , using the king of serpents as a rope,
तब अनंत गहराई से लक्ष्मी पूर्ण खिले हुए कमल से प्रकट हुईं। , Lakshmi miraculously emerged from the unfathomable depths on a fully bloomed lotus.
अपने हाथ में वैजयंती माला लेकर, , Holding a divine garland in Her hands,
उन्होंने देवताओं और दानवों को दरकिनार करते हुए, , ignoring all the greedy deities and demons,
स्वयं नारायण (विष्णु) को अपना पति , She chose Narayana (Vishnu) as Her eternal husband
और अपना शाश्वत आश्रय चुना। , and absolute refuge.

इसका एक अत्यंत गहरा और दार्शनिक अर्थ है: , This ancient mythological event signifies a profound philosophical truth:
ब्रह्मांड की सबसे बड़ी समृद्धि (लक्ष्मी) वहीं स्थायी रहती है, , True, everlasting prosperity (Lakshmi) remains permanent
जहाँ असीम शक्ति के साथ-साथ परम संरक्षण और 'धर्म' (विष्णु) होता है। , only in the presence of supreme protection and unwavering 'Dharma' (Vishnu).

वे विष्णु के वक्षस्थल (श्रीवत्स) में सदा के लिए निवास करती हैं, , She eternally resides in the chest of Vishnu (Shrivatsa),
क्योंकि ब्रह्मांडीय शक्ति को शक्तिमान से कभी अलग नहीं किया जा सकता। , for the Cosmic Energy can never be separated from the Energetic Source.
वे 'प्रकृति' का वह असीम रूप हैं जो हर जीव का मौन रहकर पोषण करता है। , She is the silent aspect of Nature (Prakriti) that continuously nourishes all life.
खेतों में लहलहाती हरी-भरी फसल वही हैं; , She is the lush, golden harvest swaying in the fields;
तपस्वियों और ज्ञानियों के जीवन में जो सौभाग्य और आंतरिक संतुलन है, , the profound fortune, peace, and internal balance in the lives of the wise—
वह साक्षात लक्ष्मी हैं। , that is entirely Lakshmi.
विजयी योद्धा के माथे का चमकता तेज , The radiant glow on a victorious warrior's forehead
और एक चक्रवर्ती राजा का अखंड ऐश्वर्य— , and the unshakeable majesty of a righteous King—
सब कुछ केवल और केवल लक्ष्मी है। , all of it is Lakshmi.

माँ लक्ष्मी का स्वरूप , The divine form of Maa Lakshmi
अत्यंत मंगलमय, शांत और प्रकाशमान माना जाता है। , is considered supremely auspicious, peaceful, and radiant.
वे लाल या स्वर्ण वस्त्र धारण करती हैं, , She wears majestic red or golden garments,
और उनके खुले हाथों से स्वर्ण और जीवनदायी अन्न की अविरल वर्षा होती है। , and from Her open palms, endless showers of gold and life-giving grain cascade down.

वे पूर्ण रूप से खिले हुए कमल पर विराजमान होती हैं (कमल-वासिनी)। , She is Kamal-Vaasini (the one seated gracefully on the lotus).
कमल हमेशा गहरे कीचड़ और दलदल में उगता है , The lotus always blooms in the thick, murky mud,
पर उसके गंदे पानी से पूरी तरह अछूता रहता है; , yet its petals remain completely untouched and unblemished by the dirt;
लक्ष्मी अपनी इस मुद्रा से हमें सिखाती हैं कि , through this posture, Lakshmi silently teaches us how to live
संसार (माया) के घोर भौतिक वैभव और आकर्षणों के बीच रहो, , amidst the intoxicating opulence of the world (Maya),
पर उससे हमेशा निर्लिप्त और मुक्त रहो। , yet remain completely detached and mentally free from it.
कमल का अर्थ ही है— , The lotus signifies the ultimate spiritual state:
संसार में रहते हुए भी भीतर से पूर्णतः पवित्र और निर्मल रहना। , remaining pure, immaculate, and uncorrupted while navigating the material world.

कई प्राचीन मूर्तियों और शास्त्रों में , In many ancient scriptures and temple carvings,
माँ लक्ष्मी के साथ हाथी (गज) दिखाई देते हैं, , elephants (Gaja) are seen standing beside Maa Lakshmi,
जो अपनी सूंड से उन पर अमृत का कलश उंडेलते हैं। , pouring pots of divine nectar over Her.
हाथी हमेशा शक्ति, राजसत्ता, , The elephant is the ultimate symbol of royal power,
विवेक और अचल स्थिरता का प्रतीक है; , wisdom, and unshakeable stability;
यह रूप 'गजलक्ष्मी' कहलाता है। , this magnificent form is worshipped as Gaja-Lakshmi.

वे अपनी अष्ट-लक्ष्मी के रूप में , She fulfills the eight critical dimensions of human life
मानव जीवन के आठ सबसे महत्वपूर्ण आयामों को पूर्ण करती हैं: , as the Ashta-Lakshmi:
आदि लक्ष्मी (सृष्टि की मूल शक्ति और शांति), , Adi Lakshmi (The Primal Power and cosmic peace),
धन लक्ष्मी (धन और ऐश्वर्य का असीमित प्रवाह), , Dhana Lakshmi (The endless flow of Wealth and Opulence),
धान्य लक्ष्मी (अन्न और प्रकृति का पोषण), , Dhanya Lakshmi (The provider of Food and agricultural Nourishment),
गज लक्ष्मी (राजसी शक्ति, पशुधन और प्रतिष्ठा), , Gaja Lakshmi (The bestower of Royal Power, livestock, and Prestige),
संतान लक्ष्मी (उत्तराधिकारी, संतान और वंश का विस्तार), , Santana Lakshmi (The granter of Progeny and the continuation of Lineage),
वीर लक्ष्मी (कठिनाइयों से लड़ने का अदम्य साहस और शक्ति), , Veera Lakshmi (The fierce Courage and Strength to overcome life's battles),
विजय लक्ष्मी (हर युद्ध और कार्य में अंतिम सफलता और विजय), , Vijaya Lakshmi (The ultimate Success and Victory in all endeavors),
और विद्या लक्ष्मी (सर्वोच्च आध्यात्मिक और सांसारिक ज्ञान)। , and Vidya Lakshmi (The highest spiritual and worldly Knowledge).

उनका सबसे बड़ा और पवित्र उत्सव दीपावली है, , Her greatest, most celebrated festival is Diwali,
जब अमावस्या की घोर अंधकारमयी रात में , when on the darkest night of the new moon,
घरों में दीप जलाए जाते हैं , lamps are lit in millions of homes,
और समृद्धि तथा मंगल की कामना की जाती है। , and fervent prayers are offered for prosperity and auspiciousness.
वे केवल बाहरी तिजोरियों में रखा धन नहीं, , She is not just the external wealth locked in a safe;
बल्कि मनुष्य के हृदय की आंतरिक समृद्धि का भी सर्वोच्च प्रतीक हैं। , She is the ultimate symbol of the soul's inner, spiritual prosperity.

लोक परंपरा में वे 'चंचला' हैं— , In folklore, She is famously known as 'Chanchala' (The Restless One)—
जो मूर्ख मनुष्य उन्हें केवल लोभ, चालाकी और अहंकार से बांधना चाहता है, , She never stays for even a moment with those foolish enough
उसके पास वे एक पल के लिए भी नहीं टिकतीं। , to try to bind Her with greed, arrogance, and cunning tricks.
लेकिन वे 'अचला' भी हैं— , But She is also 'Achala' (The Immovable One)—
जो भक्त नारायण (सत्य और धर्म) के चरणों में पूरी तरह समर्पित है, , She stays forever, unasked, in the home of the one
वे वहां बिना मांगे ही सदा के लिए स्थिर हो जाती हैं। , who is completely surrendered to Narayana (Truth and Righteousness).

लक्ष्मी के बिना यह ब्रह्मांड पूरी तरह दरिद्र (शून्य) है, , Without Lakshmi, this entire universe is Daridra (barren and impoverished),
परंतु नारायण से अलग हुई लक्ष्मी , but if forcefully separated from Narayana,
राक्षसों का भोजन बन जाती हैं और कभी स्थायी नहीं रहतीं। , Lakshmi turns into the food of demons and brings sheer destruction.
रावण ने लक्ष्मी (सीता) को बिना नारायण (राम) के चुराना चाहा, , Ravana tried to steal Lakshmi (Sita) without Narayana (Rama),
और परिणाम स्वरूप उसका पूरा साम्राज्य भस्म हो गया। , and as a direct result, his entire golden empire was burned to ashes.
इसलिए, बुद्धिमान ज्ञानी कभी केवल लक्ष्मी को नहीं मांगते, , Therefore, the truly wise never ask for Lakshmi alone;
वे हमेशा 'लक्ष्मीनारायण' को एक साथ मांगते हैं। , they always pray for 'Lakshmi-Narayana' together.

जहाँ निस्वार्थ धर्म है, वहाँ लक्ष्मी हैं। , Where there is selfless Dharma, there is Lakshmi.
जहाँ मन की स्वच्छता और शरीर का घोर परिश्रम है, वहाँ लक्ष्मी हैं। , Where there is purity of mind and hard, honest work, there is Lakshmi.
जहाँ विचारों का सौंदर्य, जीवन का संतुलन और मंगल है, , Where there is beauty of thought, cosmic balance, and auspiciousness,
वहीं लक्ष्मी का स्थायी निवास है। , there permanently resides Lakshmi.
वही श्री हैं। , She is Shri.
वही समृद्धि हैं। , She is Absolute Prosperity.
वही मंगलमयी जगन्माता लक्ष्मी हैं। , She is the supremely auspicious Jagadamba, Maa Lakshmi.

क्या आपने कभी इस घोर रहस्य पर विचार किया है , Have you ever stopped in the silence of the night to wonder
कि आप जीवन भर जिसे अपनी मुट्ठी में 'पाना' और जकड़ना चाहते हैं, , why the very thing you desperately try to 'hold' and possess
वह मुट्ठी बांधते ही , slips away like dry sand
क्यों रेत की तरह आपके हाथों से फिसल कर गिर जाता है? , the exact moment you forcefully clench your fist around it?
लक्ष्मी बहते हुए निर्मल जल की तरह हैं; , Lakshmi behaves exactly like pure, flowing water;
यदि आप अपनी तिजोरी में इसे एक जगह बांधने का प्रयास करेंगे, , try to hoard and trap it in one place,
तो यह जल सड़ जाएगा और आपके ही विनाश का कारण बनेगा, , and it stagnates, rots, and breeds disease,
लेकिन यदि आप इसे खुले हाथों से बहने देंगे, , but let it flow freely from your open hands,
तो यह सूखे पड़े खेतों और मृत सभ्यताओं को भी नया जीवन दे देगा। , and it will give boundless life to dead fields and entire civilizations.

उपनिषद हमें सिखाते हैं कि , The Upanishads whisper that
असली दरिद्रता भौतिक सिक्कों या अन्न की कमी नहीं है, , true poverty is not the physical absence of coins,
बल्कि 'और अधिक' पाने की वह नर्क जैसी अतृप्त प्यास है , but the unquenchable, hellish, burning thirst for 'more'
जो मनुष्य की आत्मा को भीतर से खोखला कर देती है। , that leaves the human soul entirely hollow and diseased.
क्या तिजोरी के घुप अंधेरे में बंद वह सोना सचमुच आपका है, , Is the heavy gold locked safely in the pitch dark of your vault truly yours,
या आप उस पीले, चमकीले पत्थर के , or have you merely reduced yourself to
एक अवैतनिक, डरे हुए और चिंतित पहरेदार मात्र बन गए हैं? , an unpaid, highly anxious security guard of a shiny yellow metal?

तंत्र शास्त्रों के अनुसार, , According to Tantric geometry,
माँ लक्ष्मी वह अदृश्य 'श्री-तत्व' हैं , Maa Lakshmi is the unseen 'Shri-Tattva'
जो प्रकृति के हर खुलते हुए पत्ते, , hidden perfectly in the unfurling of every green leaf,
हर शंख की बनावट , the spiral of every ocean seashell,
और इस अनंत आकाशगंगा के गणित में पूरी तरह छिपा हुआ है। , and the magnificent mathematics of every swirling galaxy in the cosmos.
जो मनुष्य उन्हें केवल भौतिक वस्तुओं, महलों और सिक्कों में खोजता है, , He who seeks Her exclusively in dead material objects and towering mansions
वह जीवन भर एक तपते हुए रेगिस्तान में , spends his entire, exhausted life endlessly chasing
मृगतृष्णा (Illusion) के पीछे हांफता हुआ भागता रहता है। , a cruel, mocking mirage in a burning desert.

वे तो उस अलौकिक, अकारण संतोष में बसती हैं , She actually resides in that profound, quiet, causeless contentment
जो बिना किसी भौतिक कारण के, गहराई से भीतर से उपजता है। , that blooms spontaneously from the deepest part of your being.
जब आप नारायण के सत्य, न्याय और धर्म को , When you firmly anchor the absolute truth and Dharma of Narayana
अपने हृदय की गहराइयों में उतार कर उसे अपना स्वभाव बना लेते हैं, , within the core of your heart, making it your very nature,
तो आपको लक्ष्मी के पीछे भागना नहीं पड़ता— , you no longer have to frantically run out to seek Lakshmi—
वे स्वयं इस पूरे ब्रह्मांड को पार करते हुए, , She will cross the vastness of the cosmos
आपके द्वार तक चलकर आती हैं। , to find you at your door.

अस्तित्व का सबसे बड़ा और सबसे गुप्त रहस्य यह है , The greatest, most hidden mystery of existence is this:
कि इस ब्रह्मांड का सारा ऐश्वर्य, सारी पूर्णता , the boundless, unimaginable opulence of the entire universe
पहले से ही आपके भीतर एक बीज रूप में मौजूद है। , is already flawlessly encoded within your spirit like a dormant seed.
आप बाहर भिखारी की तरह भीख मांग रहे हैं, , You are crying like a beggar in the streets,
जबकि आप एक राजा के खजाने पर सोए हुए हैं; , while sleeping on top of an emperor's buried treasure;
बस आपको मोह की नींद से जागकर , you only need to wake up from the illusion of Maya
उसे देखने वाली आंतरिक दृष्टि को खोलना है। , and open the inner eyes capable of seeing it.

ब्रह्मा कौन हैं? — , Who is Brahma? —
वे "विधाता" हैं, अस्तित्व के प्रथम शिल्पकार। , The Cosmic Architect (Vidhaata).
सृष्टि के रचयिता माने जाते हैं। , He is considered the ultimate creator of the universe,
हिन्दू दर्शन में उन्हें सृष्टि के आरंभ का देवता कहा गया है। , the supreme deity of the beginning of creation in Hindu philosophy.

यदि विष्णु 'पालन की चेतना' हैं , If Vishnu represents the 'Consciousness of Preservation'
और शिव 'परम चेतना' हैं, , and Shiva embodies the 'Supreme Consciousness',
तो ब्रह्मा वह 'बुद्धि' हैं , Brahma is the profound 'Intellect'
जो असीम निराकार को एक निश्चित आकार देती है। , that gives a definite, intricate form to the Formless.

पुराणों के अनुसार, , According to the ancient Puranas,
सृष्टि के प्रारम्भ में केवल एक घोर, अनंत जल (प्रलय) था। , in the very beginning, there was only the endless, dark cosmic water (Pralaya).
उस अथाह अंधकारमयी जल पर विष्णु योगनिद्रा में विराजमान थे। , Upon those unfathomable waters, Vishnu rested in His Yogic sleep (Yoganidra).
तब विष्णु की नाभि से एक अलौकिक कमल उत्पन्न हुआ, , From the navel of the sleeping Vishnu, a magnificent, glowing lotus emerged,
और उस कमल के मध्य में ब्रह्मा प्रकट हुए— , and seated perfectly in the center of that lotus, Brahma manifested—
इसलिए उन्हें 'कमलज' (कमल से उत्पन्न) कहा जाता है। , hence He is revered as 'Kamalaja' (The Lotus-born).
वे ही 'हिरण्यगर्भ' हैं— , He is 'Hiranyagarbha'—
वह आदिम सुनहरा महा-गर्भ, , the primordial, golden cosmic womb,
जिसके फूटने से इस सम्पूर्ण ब्रह्मांड का जन्म हुआ। , the bursting of which gave violent birth to this entire multiverse.

इसका अर्थ है कि 'सृजन' का जन्म , This deeply signifies that 'Creation' can only rise
केवल 'पालन' के आधार पर ही हो सकता है। , from the unshakeable foundation of 'Preservation'.
विष्णु अपनी योगनिद्रा में सृष्टि का स्वप्न देखते हैं, , Vishnu silently dreams the cosmos in His cosmic slumber,
और ब्रह्मा उस मौन स्वप्न को , and Brahma takes that silent dream
ईंट-पत्थर, ग्रहों, नक्षत्रों और प्राणों का भौतिक रूप देते हैं। , and meticulously builds its physical stage with matter, planets, and life force.

ब्रह्मा का स्वरूप अत्यंत प्रतीकात्मक और गूढ़ है। , His physical form is deeply symbolic and profoundly esoteric.
वे 'चतुर्मुखी' हैं, , He is Chaturmukha (Four-Faced),
जो चारों दिशाओं में ज्ञान के निर्बाध प्रसार का प्रतीक है। , representing the absolute dissemination of cosmic knowledge in all four cardinal directions.
उनके चार मुखों से ही चार वेदों का नाद हुआ— , From His four divine mouths echoed the sacred sounds of the four Vedas—
ऋग्वेद, यजुर्वेद, सामवेद और अथर्ववेद— , Rigveda, Yajurveda, Samaveda, and Atharvaveda—
इसलिए वे इस ब्रह्मांड में ज्ञान के प्रथम प्रवर्तक माने जाते हैं। , making Him the primal, ultimate source of wisdom in the universe.
उनके चार मुख समय के चार युगों (सतयुग, त्रेता, द्वापर, कलियुग) , His four faces also bear witness to the four Yugas (epochs of time)
और मानव जीवन के चार आश्रमों के भी साक्षी हैं। , and the four ashramas (stages) of human life.

उनकी चार भुजाएँ सृजन की शक्तियों की प्रतीक हैं; , His four arms represent the supreme powers of creation;
उनके हाथों में वेद (ज्ञान का शाश्वत स्रोत), , He holds the Vedas (the eternal, unwritten source of knowledge),
अक्षमाला (समय और श्वासों की निरंतर गणना), , the Akshamala or Rosary (representing the relentless calculation of time and breaths),
स्रुवा (यज्ञ और कर्मकांड का प्रतीक), , the Sruva (the ladle representing sacrifice and action),
और कमंडल (सृष्टि का आदिम जल) है। , and the Kamandalu (the pot holding the primal water of creation).

वे कमल पर विराजमान हैं , Seated upon a pure lotus,
जो सृष्टि के घोर कीचड़ में भी शुद्धता के जन्म का प्रतीक है। , He symbolizes the birth of absolute purity even from the chaotic mud of existence.
उनका वाहन 'हंस' है, , His vehicle is the majestic swan (Hamsa),
जिसे 'नीर-क्षीर विवेक' प्राप्त है— , a bird mythologically known for 'Neer-Ksheer Viveka'—
अर्थात् वह जो पानी में से केवल दूध को ग्रहण कर लेता है। , the extraordinary ability to drink only the pure milk mixed within water.
यह हंस उस परम विवेक का प्रतीक है, , This swan represents the ultimate discernment,
जो सत्य (आत्मा) और असत्य (माया) को अलग करने की क्षमता रखता है। , the supreme intellect required to separate the eternal Truth (Atman) from the grand illusion (Maya).
सरस्वती (परम ज्ञान) उनकी आदि-शक्ति हैं; , Saraswati (Supreme Wisdom) is His divine consort and power;
क्योंकि ज्ञान और विवेक के बिना, , because without wisdom and discernment,
कोई भी सृजन केवल एक अंधा विध्वंस बन जाता है। , any act of creation inevitably devolves into blind destruction.

वे 'काल' (Cosmic Time) के महा-रचयिता हैं। , He is the undisputed Master of Cosmic Time (Kala).
उनका एक दिन, जिसे 'कल्प' कहा जाता है, , A single day of Brahma, known as a 'Kalpa',
अरबों मानव वर्षों के बराबर होता है। , spans over billions of human years.
जब ब्रह्मा का दिन आरम्भ होता है, तो सुप्त सृष्टि जाग्रत होकर प्रकट होती है; , When the day of Brahma finally dawns, the slumbering creation wakes up and manifests;
और जब उनकी रात्रि आती है, , and when His night arrives,
तो यह पूरा दृश्यमान जगत घोर प्रलय के जल में डूबकर लय में चला जाता है। , the entire visible universe drowns in the apocalyptic waters of dissolution.

वे 'रजोगुण' के परम स्वामी हैं— , He embodies 'Rajo Guna'—
वह अथाह और बेचैन ऊर्जा जो स्थिर को निरंतर गतिशील बनाती है। , the restless, dynamic, and passionate energy that sets stagnant matter into motion.
वे अपने मानस पुत्रों— , He expands the universe through His 'Manas Putras' (Mind-born sons)—
मरिचि, अत्रि, अंगिरा, पुलस्त्य, पुलह, क्रतु, वशिष्ठ, और नारद— , the great sages like Marichi, Atri, Narada, and Vashistha.
के माध्यम से सृष्टि का विस्तार करते हैं। , Through them, cosmic wisdom and progeny spread.
वे ही हर जीव के माथे पर उसका भाग्य (विधि) लिखते हैं, , He is the one who writes the destiny (Vidhi) on the forehead of every living being,
पर वे स्वयं भी कर्म के अटल नियमों से बंधे हुए हैं। , yet He Himself remains strictly bound by the inescapable laws of Karma.

ब्रह्मा की पूजा पृथ्वी पर कम क्यों होती है? , Why is Brahma so rarely worshipped on Earth?
पुराणों में एक प्रसिद्ध कथा है , A famous Puranic legend tells of a fierce dispute
कि एक बार ब्रह्मा और विष्णु के बीच श्रेष्ठता का विवाद हुआ। , between Brahma and Vishnu over absolute supremacy.
तब महादेव एक अनंत, प्रज्वलित ज्योति स्तंभ के रूप में प्रकट हुए। , To test them, Lord Shiva appeared as an endless, blazing pillar of light (Jyotirlinga).
ब्रह्मा ने उस स्तंभ का अंत खोजने के लिए हंस का रूप धरा, , Brahma took the form of a swan to find its top,
परंतु अंत न मिलने पर उन्होंने 'केतकी' के फूल के साथ मिलकर असत्य कहा। , but failing to do so, He conspired with the Ketaki flower and told a lie.
सत्य को छिपाने के इस प्रयास के कारण , Because of this desperate attempt to veil the truth,
उन्हें शिव का श्राप मिला कि उनकी पूजा पृथ्वी पर नहीं होगी। , He was cursed by Shiva that He would not be worshipped in temples.

किन्तु ऋषियों के अनुसार, इसका एक बहुत गहरा दार्शनिक अर्थ भी है— , But the ancient sages reveal a much deeper, philosophical meaning to this curse—
ब्रह्मा 'मन' और 'सृजन की बुद्धि' के प्रतीक हैं। , Brahma perfectly represents the 'Mind' and the 'Intellect of Creation'.
मन ही इस मायावी संसार को बनाता है, , It is the Mind that creates this illusory world,
मन ही संसार के आकर्षणों में बुरी तरह उलझता है, , it is the Mind that gets deeply entangled in its own desires,
और मन ही 'मैं' और 'तू' का भेद (द्वैत) पैदा करता है। , and it is the Mind that breeds the illusion of duality (Me versus You).
मोक्ष (मुक्ति) पाने के लिए, , To attain ultimate liberation (Moksha),
मनुष्य को अपने मन (ब्रह्मा) की सीमाओं से परे जाकर, , a seeker must transcend the boundaries of the Mind (Brahma)
विशुद्ध आत्मा (शिव/विष्णु) में लीन होना पड़ता है। , and completely merge with the pure, thoughtless Soul (Shiva/Vishnu).
हम उस घर (सृजन) का सम्मान तो करते हैं, , We deeply respect the builder of the house,
पर हमारा अंतिम लक्ष्य उस घर को बनाने वाले से परे 'सत्य' को पाना है। , but our ultimate goal is to step outside the house to find the infinite sky of 'Truth'.

लेकिन अब वेदांत की गहराई में उतर कर इस रहस्य पर विचार करें: , But ponder this absolute mystery, buried deep in the Vedas:
क्या कोई भी रची गई वस्तु वास्तव में अपने ही रचयिता को पूरी तरह समझ सकती है? , How can any created intellect possibly comprehend its own creator?
क्या एक चित्र कभी उस चित्रकार की आँख को देख सकता है जिसने उसे रंगा है? , Can a painted canvas ever turn around and see the brush that painted it?
ऋग्वेद का 'नासदीय सूक्त' सृष्टि के इस सबसे बड़े रहस्य पर प्रश्न उठाता है: , The 'Nasadiya Sukta' of the Rigveda questions the very foundation of creation:
"सृष्टि के आरम्भ में न असत् था, न सत् था। , "In the beginning, there was neither existence nor non-existence.
न अंतरिक्ष था, न आकाश था। , There was no atmosphere, nor the sky beyond it.
तब यह सृष्टि कहाँ से आई? , From where did this creation arise?
क्या वह परम अध्यक्ष, जो परम व्योम में बैठा है, वह इसे जानता है? , Does the Supreme Overseer in the highest heaven know?
या शायद, वह भी नहीं जानता!" , Or perhaps, even He does not know!"

ब्रह्मा वह परम रहस्य हैं , Brahma is the ultimate, mind-bending mystery
जहाँ मानवीय तर्क, बुद्धि और दर्शन की सभी सीमाएँ , where the borders of human logic, philosophy, and reason
पूरी तरह से टूट कर शून्यता में गिर जाती हैं। , simply dissolve into absolute nothingness.
हम हर दिन, हर पल अपने अनगिनत विचारों से , Think about it—we weave our own personal universes
अपने ही एक नए मानसिक ब्रह्मांड की रचना करते हैं— , every single moment through our ceaseless thoughts.
क्या हम सब अपने भीतर एक छोटे 'ब्रह्मा' नहीं हैं? , Are we not all miniature Brahmas in our own right?
जब आप रात में गहरी नींद में एक स्वप्न देखते हैं, , When you fall asleep and enter a vivid dream,
तो उस स्वप्न के विशाल पेड़, पहाड़ और लोग कहाँ से आते हैं? , where do the giant trees, mountains, and the strangers in that dream come from?
वे केवल आपके ही मन के संकल्प से उपजते हैं, , They are entirely projected by the sheer willpower of your own mind,
और आँख खुलते ही लुप्त हो जाते हैं। , and they vanish the second your eyes open.

ठीक उसी प्रकार, , In the exact same way,
यह संपूर्ण भौतिक जगत, , this staggering physical reality,
इसके अनंत तारे, आकाशगंगाएँ और इसका विस्तृत इतिहास, , with all its burning stars, galaxies, and endless history,
ब्रह्मा के विशाल मन का एक उठा हुआ विचार मात्र है। , is nothing but a fleeting, rising thought inside the colossal mind of Brahma.
जिस दिन आपके भीतर विचारों का यह कोलाहल पूरी तरह शांत हो जाएगा, , The very moment the relentless, deafening noise of your own thoughts ceases,
उस दिन ब्रह्मा की यह विशाल, जटिल सृष्टि , the intricate creation of Brahma
आपके लिए हमेशा के लिए तिरोहित (गायब) हो जाएगी। , will vanish from your perception,
तब आप उस नग्न 'सत्य' को देख पाएंगे , revealing the naked, terrifying 'Truth'
जो इस ब्रह्मांड की रचना से पहले भी अचल था , that existed long before the first star was born,
और इसके भस्म होने के बाद भी अचल रहेगा। , and will remain after the last star dies.

नियति (विधि) जो ब्रह्मा ने लिखी है, , The destiny (Vidhi) He has written on your forehead
वह पत्थर पर उकेरी गई कोई बेजान लकीर नहीं है, , is not a rigid script carved helplessly into stone;
बल्कि आपके जन्म-जन्मांतर के संस्कारों और कर्मों का , it is a highly subtle, living ledger
एक अत्यंत सूक्ष्म, जीवित और स्पंदित लेखा-जोखा है। , of your own past karmas and deep-rooted Samskaras.
आप केवल किसी पुरानी कहानी को जी नहीं रहे हैं, , You are not just blindly acting out a pre-written story;
बल्कि अपनी हर श्वास और अपनी जाग्रत चेतना से , you are actively rewriting it
हर पल उस नियति को फिर से लिख रहे हैं। , with every single pulse of your awakened consciousness.

ज़रा आँखें बंद करके इस शून्यता में सोचिए: , Close your eyes and stare into the void:
क्या यह संभव है कि यह अनंत ब्रह्मांड , Is it entirely possible that this boundless universe
बाहर किसी दिशाहीन अंधकार में नहीं फैल रहा है, , is not expanding out there in the dark, empty space,
बल्कि आपके अपने ही मन की , but is actually unfolding deep within
अनंत और रहस्यमयी परतों के बहुत भीतर खुल रहा हो? , the infinite, mysterious folds of your own mind?
जिस दिन आप अपने 'मन' (ब्रह्मा) के पार चले जाएंगे, , The day you finally step beyond your 'Mind' (Brahma),
आपको ज्ञात होगा कि जिसे आप दुनिया समझ रहे थे, , you will realize that the world you thought was so real,
वह केवल आपके ही विचारों की एक परछाई थी। , was only ever a shadow cast by your own thoughts.

सरस्वती कौन हैं? — , Who is Saraswati? —
वे "वाक" (दिव्य वाणी) और "विवेक" (परम सत्य का ज्ञान) हैं। , She is "Vak" (The Supreme Divine Speech) and "Viveka" (Absolute Discrimination).
माँ सरस्वती असीम ज्ञान, तीक्ष्ण बुद्धि, नाद, कला और विद्या की आदि-देवी हैं। , Maa Saraswati is the primordial Goddess of knowledge, intellect, profound speech, pure arts, and all cosmic learning.
वे विशुद्ध चेतना की वह जीवंत अभिव्यक्ति हैं , She is the ultimate expression of pure, unadulterated consciousness
जो अज्ञान के घने अंधकार को , that mercilessly dispels the thick, suffocating darkness of ignorance
ब्रह्म-ज्ञान के तीखे प्रकाश से चीर देती हैं। , with the blinding light of self-realization and wisdom.

यदि ब्रह्मा 'रचना' का आधार हैं, , If Lord Brahma represents the brutal 'Construction' of reality,
तो सरस्वती वह 'ज्ञान' हैं जिसके बिना कोई भी रचना संभव नहीं। , Saraswati is the divine 'Blueprint' without which nothing can be built.
ब्रह्मा यदि चलायमान 'मन' हैं, , If Brahma is the restless, wandering 'Mind',
तो सरस्वती वह स्थिर 'बुद्धि' हैं जो उस मन को सही दिशा देती है। , Saraswati is the sharp, unwavering 'Intellect' that guides and reigns in that Mind.
उनके बिना ब्रह्मा का विशाल सृजन , Without Her divine presence,
केवल मृत पत्थर, गैस और मिट्टी का एक अर्थहीन ढेर है; , Brahma's massive creation is merely a chaotic pile of dead matter and dust;
सरस्वती ही उस जड़ पदार्थ को 'अर्थ', 'नाम' और 'चेतना' देती हैं। , It is Saraswati alone who breathes 'Meaning', 'Name', and 'Purpose' into it.
उन्हें वाग्देवी, शारदा, वीणापाणी, , She is reverently known as Vagdevi (Goddess of Speech), Sharada, Veenapani,
और संपूर्ण ब्रह्मांड की विद्या की देवी कहा जाता है। , and the supreme Mother of all universal wisdom.

“सरस्वती” शब्द का संस्कृत अर्थ है: , The sacred Sanskrit word "Saraswati" translates to:
'सरस' (निरंतर बहने वाला ज्ञान या प्रवाह) , 'Saras' (the endless, flowing essence of knowledge)
और 'वती' (उसे धारण करने वाली)। , and 'Wati' (the one who profoundly possesses it).
अर्थात् वह जो ज्ञान और चेतना के , Meaning, She is the one who eternally holds
कभी न रुकने वाले प्रवाह को अपने भीतर धारण करती हैं। , the continuous, unbreaking flow of supreme wisdom and cosmic intellect.

वे 'सरस-वती' हैं— , She is 'Saras-wati'—
वह जो एक शाश्वत नदी की भांति सतत प्रवाहमान है। , She who flows continuously like a sacred, hidden river.
वे ज्ञान की वह रहस्यमयी, अदृश्य नदी हैं , She is the invisible, subterranean river of spiritual wisdom
जो बाहर भूमि पर नहीं, बल्कि हर जीवात्मा के भीतर , that does not flow on earth,
'अंतर्ज्ञान' (Intuition) बनकर बहती है। , but deep within every living being as 'Intuition'.
शब्दों के भीतर छिपा हुआ जो गहरा अर्थ है, , The hidden meaning locked deep within spoken words,
कंठ से निकलने वाले स्वर में जो संगीत है, , the soul-stirring music that rises from the throat,
और गहरे मौन में जो अचानक उपजने वाली समझ है— , and the sudden, profound understanding that blossoms in absolute silence—
वही साक्षात सरस्वती हैं। , that is entirely Saraswati.

माँ सरस्वती का रूप , The divine form of Maa Saraswati
अत्यंत शांत, स्थिर और परम पवित्र माना जाता है। , is universally considered to be supremely peaceful, still, and untainted.
वे पूर्णतः श्वेत-वस्त्रा हैं; , She is always clad in brilliant White (Shveta-Vastra);
संसार के सभी चटकीले रंगों (राग, द्वेष, क्रोध, और लोभ) से परे, , standing completely beyond the worldly colors of passion, hatred, anger, and greed,
वे परम शांति , She represents the ultimate, undisturbed Peace
और 'सत्व गुण' (विशुद्ध पवित्रता) का अंतिम प्रतीक हैं। , and the absolute pinnacle of 'Sattva Guna' (Flawless Purity).

वे एक श्वेत कमल पर विराजमान हैं, , Seated upon a pristine white lotus,
जो यह दर्शाता है कि सच्चा ज्ञान हमेशा अहंकार के कीचड़ से ऊपर, , She symbolizes that true knowledge remains pure and elevated,
अत्यंत पवित्र और निर्मल होता है। , completely untouched by the muddy waters of human ego and worldly desires.
उनके चार हाथों में वीणा (संगीत और ब्रह्मांडीय नाद), , In Her four divine hands, She holds the Veena (the instrument of cosmic music and Naad),
पुस्तक (वेद और अनंत ज्ञान), , the sacred Book (the Vedas and all infinite knowledge),
स्फटिक की माला (गहरा ध्यान और एकाग्रता), , the Crystal Rosary (symbolizing deep focus, meditation, and concentration),
और कमंडल (पवित्र जल) है। , and the Kamandalu (the pot holding the pure water of consciousness).

उनके हाथों की वीणा कोई साधारण वाद्ययंत्र नहीं है; , The Veena She plays is not merely an instrument of art;
यह हमें जीवन का सबसे बड़ा रहस्य सिखाती है। , it is a profound teacher of the greatest philosophy of life.
वीणा के तार न तो बहुत ढीले होने चाहिए (आलस्य और प्रमाद), , It teaches that the strings of a human life should neither be too loose (leading to lethargy and failure)
और न ही बहुत अधिक कसे हुए होने चाहिए (क्रोध और तनाव); , nor pulled too tight (leading to anxiety, anger, and snapping);
केवल एक पूर्ण संतुलन में ही जीवन का असली संगीत प्रकट होता है। , only in a state of perfect, mindful balance does the beautiful music of life truly emerge.
उनका वाहन 'हंस' है (हंस-वाहिनी)। , She rides the majestic Swan (Hamsa-Vahini).
हंस सत्य और असत्य में, , In ancient Vedic lore, the Swan is the ultimate symbol of the awakened intellect,
दूध और पानी में सटीक भेद करने की कुशाग्र बुद्धि का प्रतीक है। , said to possess the mythical ability to drink pure milk and leave the water behind.
सरस्वती मनुष्य को वह अमोघ 'विवेक' देती हैं , Saraswati grants the spiritual seeker this exact 'Viveka' (Discrimination)—
जिससे वह इस नश्वर संसार और अनश्वर आत्मा के बीच स्पष्ट भेद कर सके। , the razor-sharp ability to clearly distinguish between the eternal Truth (Atman) and the illusions of the material world (Maya).

तंत्र और वेदों के गूढ़ ज्ञान के अनुसार, , According to the esoteric knowledge of Tantra and the Vedas,
वे केवल शब्दों की देवी नहीं, बल्कि 'नाद ब्रह्म' (Sound as the Ultimate Reality) हैं। , She is not just the Goddess of words, but 'Nada Brahman'—the Universe as Sound.
वेदों की वाणी सरस्वती हैं। , The voice of the sacred Vedas is Saraswati Herself.
तंत्र में वाणी के चार स्तर बताए गए हैं: , Tantric philosophy divides speech into four profound levels:
परा (नाभि में स्थित वह विचार जो अभी तक शब्द नहीं बना), , Para (the transcendent thought resting in the navel),
पश्यंती (हृदय में स्थित वह विचार जिसे केवल महसूस किया जा सकता है), , Pashyanti (the intuitive vision at the heart that can only be felt),
मध्यमा (गले में स्थित वह विचार जिसे मन ने आकार दे दिया है), , Madhyama (the formulated thought reaching the throat),
और वैखरी (मुख से निकला हुआ वह भौतिक शब्द जो दुनिया सुनती है)। , and Vaikhari (the physical word finally spoken to the world).
माँ सरस्वती इन चारों वाणियों की अधिष्ठात्री हैं। , Maa Saraswati is the absolute sovereign of all these four states of speech.
वे उस बिंदु (Sphota) की स्वामिनी हैं जहाँ निर्गुण मौन, , She is the master of 'Sphota'—
सगुण शब्द बनकर फूट पड़ता है। , the exact, explosive moment when silent thought bursts into meaning.

जगत में जो भी विद्या है— , Every single form of knowledge in this vast universe—
चाहे वह भौतिक विज्ञान हो, खगोल शास्त्र हो, कला हो, या गहन अध्यात्म— , be it quantum mechanics, astronomy, classical arts, or deep spiritual awakening—
वह सब उसी एक महा-चेतना की बिखरी हुई किरणें हैं। , is merely a scattered ray of Her infinite, blinding light.
लक्ष्मी (धन) अत्यंत चंचला है, वह आज है और कल नहीं; , Wealth (Lakshmi) is notoriously restless and moving; it is here today and gone tomorrow.
पर ज्ञान की देवी सरस्वती पूर्णतः स्थिर हैं। , But Wisdom (Saraswati) is unshakeably stable.
जो ज्ञान और विवेक एक बार भीतर उतर गया, , Wisdom, once truly attained and realized within the soul,
उसे दुनिया का कोई चोर चुरा नहीं सकता, , can never be stolen by a thief in the night,
और कोई क्रूर राजा उसे छीन नहीं सकता। , nor can it ever be seized by the most powerful king.

प्राचीन काल में गुरुकुल में विद्या आरंभ करने से पहले , Before acquiring any form of learning,
ऋषि और विद्यार्थी सबसे पहले माँ सरस्वती की ही उपासना करते थे। , ancient sages, students, artists, and writers always bow their heads and pray to Maa Saraswati.
उनका प्रमुख उत्सव बसंत पंचमी है, , Her principal celebration is Vasant Panchami,
जो प्रकृति के नव-निर्माण और ज्ञान के प्रस्फुटन का दिन है। , the auspicious day of nature's renewal and the blossoming of wisdom.
ब्रह्मा (सृजन) को पूजने से पहले , Before one can worship Brahma (the power of Creativity),
सरस्वती (ज्ञान) को साधना इसलिए परम आवश्यक है, , one must strictly invoke Saraswati (the power of Wisdom),
क्योंकि अज्ञानी मनुष्य के हाथों में दी गई सृजन की शक्ति , because granting the power of creation to an ignorant, foolish mind
अंततः स्वयं उसके और संसार के विनाश का कारण बनती है। , will ultimately and inevitably lead to horrific destruction.

माँ सरस्वती केवल मंदिरों में पूजी जाने वाली कोई बाहरी मूर्ति नहीं हैं; , Maa Saraswati is not merely an external Goddess carved in white marble;
वे मनुष्य के मस्तिष्क और हृदय के भीतर स्थित जाग्रत प्रज्ञा हैं। , She is the raw power of knowledge situated deep within the human brain and spirit.
जब मन पूरी तरह शांत होता है और विचार स्थिर होते हैं, , When the mind becomes completely still and the turbulent intellect clears,
तब भीतर सरस्वती तत्व प्रकट होता है। , the Saraswati element organically manifests from within.
वे अज्ञान (अविद्या) के घने अंधकार को हमेशा के लिए मिटा देने वाली प्रभात हैं। , She is the golden Dawn that permanently dispels the suffocating darkness of cosmic Ignorance (Avidya).

लेकिन इस अद्वैत सत्य की गहराई में उतर कर विचार करें: , But consider this terrifying, deeply profound reality of Vedanta:
कल्पना कीजिए कि यदि इस दुनिया के सभी शब्द, सभी भाषाएँ, , If every single word ever spoken by humanity,
और ताड़पत्रों से लेकर सर्वरों तक की सभी पुस्तकें रातों-रात जलकर राख हो जाएं, , every ancient palm leaf, and every written book were to be mysteriously burned to ashes,
तो क्या 'ज्ञान' समाप्त हो जाएगा? नहीं। , would wisdom cease to exist? No.
माँ सरस्वती उस असीम, अथाह मौन (Silence) की देवी हैं , Maa Saraswati is the Goddess of that profound, terrifying Silence
जो सभी शब्दों और सभी ध्वनियों के जन्म का असली कारण है। , which acts as the eternal womb for all sounds and all creations.

जो ज्ञान हम बाहरी किताबों या गुरुओं के शब्दों में खोजते हैं, , The knowledge we frantically search for from external teachers and ancient scriptures
वह केवल एक मृत सूचना (Information) है। , is merely dead data and borrowed information;
असली ज्ञान (प्रज्ञा) तो वह 'शून्यता' है , true, awakened wisdom is the absolute 'Emptiness' (Shunyata)
जहाँ से हर मौलिक विचार, हर कविता और हर मंत्र , from which every original thought, every poem, and every mantra
ब्रह्मांड में पहली बार जन्म लेता है। , springs forth for the first time.
वीणा के तारों को पीटने से संगीत पैदा नहीं होता, , Realize that the true, mesmerizing music of the Veena
असली संगीत तो , does not come from the aggressive plucking of the physical strings themselves,
उन तारों के बीच मौजूद उस अदृश्य खाली जगह (Space) से उत्पन्न होता है , but from the empty, silent space
जो उस कंपन (Vibration) को गूंजने की अनुमति देती है। , vibrating between those strings.

क्या आपने कभी एकांत में ध्यान दिया है , Have you ever noticed, in the dead of the night,
कि जब आप अत्यंत गहरे विचार या पूर्ण मौन में होते हैं, , that in your deepest moments of contemplation and utter silence,
तो एक अदृश्य, बिना आवाज़ की आवाज़ आपके भीतर आपसे बात करती है? , an invisible, soundless voice begins to speak to you from within?
वह आवाज़ किसकी है? , Whose voice is that?
वह आपकी अपनी जाग्रत आत्मा, साक्षात सरस्वती हैं। , That is your awakened soul. That is Saraswati.

वे आपको यह सबसे कठोर सत्य सिखाती हैं , She teaches us the hardest, most ego-crushing lesson of all:
कि मानव बुद्धि का सबसे बड़ा शिखर यह जानना है , that the absolute zenith of human intelligence
कि आप इस रहस्यमयी ब्रह्मांड के बारे में वास्तव में कुछ भी नहीं जानते। , is the humble, devastating realization that you know absolutely nothing about this cosmos.
जिस क्षण एक मनुष्य अपने 'मैं सब जानता हूँ' के अहंकार को त्याग कर, , When a human being completely and utterly surrenders
अपने पूर्ण अज्ञान को पूरी तरह स्वीकार कर लेता है, , to their own profound ignorance, shedding the heavy armor of the ego,
तब एक बहुत बड़ा चमत्कार घटित होता है— , a magnificent miracle happens—
ब्रह्मांड के सभी गूढ़ रहस्य उसके सामने अपने आप खुलने लगते हैं। , the universe begins to organically decode its deepest, most guarded secrets directly into their soul.

जिसे आप अपनी कुशाग्र बुद्धि का चमत्कार मानकर अहंकार करते हैं, , What you proudly and arrogantly consider the brilliant flashes of your own intellect
वह तो केवल उस महा-चेतना की एक अत्यंत छोटी सी किरण है , is merely a microscopic, passing ray of Her infinite cosmic consciousness
जो संयोग से आपके मन के मैले दर्पण पर पड़ रही है। , briefly reflecting off the dirty mirror of your human mind.
अंतिम सत्य को कभी किसी किताब में पढ़ा नहीं जा सकता, , The ultimate Truth of the universe cannot ever be read in a book;
उसे केवल अपनी चेतना में 'अनुभव' किया जा सकता है। , it can only be vividly, intensely 'experienced'.
जिस दिन आप दुनिया के शब्दों में उत्तर खोजना हमेशा के लिए बंद कर देंगे, , The exact day you completely stop looking for answers in the noise of the outside world,
उसी दिन भीतर बैठी सरस्वती , the Saraswati sitting silently within you
आपके कानों में 'अहं ब्रह्मास्मि' (मैं ही ब्रह्म हूँ) का सबसे बड़ा रहस्य , will lean in and whisper the universe's greatest secret—'Aham Brahmasmi' (I am the Cosmos)—
मौन रहकर फुसफुसाएंगी। , directly into your awakened soul.`;

// ============================================================================
// PARSER LOGIC: Before ' , ' is Hindi (lang === 'hi'), After ' , ' is English
// ============================================================================
const parseBlocks = (lang) =>
  God.split('\n\n').map((block) =>
    block
      .split('\n')
      .map((line) => {
        const idx = line.indexOf(' , ');
        if (idx === -1) return line;
        return lang === 'hi' ? line.slice(0, idx) : line.slice(idx + 3);
      })
      .join('\n')
  );

const getRealmIndexForStanza = (text) => {
  const firstLine = text.split('\n')[0];
  if (firstLine.includes('महादेव कौन हैं') || firstLine.includes('Who is Mahadev')) return 0;
  if (firstLine.includes('माँ (आदि-शक्ति)') || firstLine.includes('Who is Maa')) return 1;
  if (firstLine.includes('विष्णु कौन हैं') || firstLine.includes('Who is Vishnu')) return 2;
  if (firstLine.includes('लक्ष्मी कौन हैं') || firstLine.includes('Who is Lakshmi')) return 3;
  if (firstLine.includes('ब्रह्मा कौन हैं') || firstLine.includes('Who is Brahma')) return 4;
  if (firstLine.includes('सरस्वती कौन हैं') || firstLine.includes('Who is Saraswati')) return 5;
  return -1;
};

// ============================================================================
// 5. TRUE CRYSTAL GLASSMORPHISM CSS ENGINE
// ============================================================================
const CRYSTAL_GLASS_CSS = `
  html, body, #root {
    background-color: #f4f7fb !important;
    color: #0f172a !important;
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    overflow-x: hidden;
    overflow-y: auto !important;
    scroll-behavior: smooth;
  }
  .wig-page {
    min-height: 100vh;
    position: relative;
    color: #0f172a;
    padding-bottom: 90px;
    background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #fdf2f8 100%);
  }
  /* Floating Ambient Color Orbs behind Glass Cards */
  .wig-aura-orb-1 {
    position: fixed;
    top: 8%;
    left: 12%;
    width: 420px;
    height: 420px;
    border-radius: 999px;
    filter: blur(95px);
    pointer-events: none;
    z-index: 0;
    transition: background 0.8s ease;
  }
  .wig-aura-orb-2 {
    position: fixed;
    bottom: 10%;
    right: 10%;
    width: 460px;
    height: 460px;
    border-radius: 999px;
    filter: blur(105px);
    pointer-events: none;
    z-index: 0;
    transition: background 0.8s ease;
  }
  .wig-canvas-bg {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }
  .wig-progress-wrap {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(255, 255, 255, 0.35);
    z-index: 100;
  }
  .wig-progress-bar {
    height: 100%;
    transition: width 0.15s ease-out, background 0.5s ease;
  }
  /* Frosted Crystal Glass Navbar */
  .wig-navbar {
    position: sticky;
    top: 0;
    z-index: 90;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 24px;
    background: rgba(255, 255, 255, 0.35);
    backdrop-filter: blur(24px) saturate(190%);
    -webkit-backdrop-filter: blur(24px) saturate(190%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.75);
    box-shadow: 0 8px 32px rgba(15, 23, 42, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.9);
  }
  .wig-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
  }
  .wig-logo {
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -0.04em;
    background: linear-gradient(90deg, #4f46e5, #e11d48, #d97706);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .wig-tag {
    font-size: 11px;
    font-weight: 800;
    padding: 4px 12px;
    border-radius: 999px;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.8);
  }
  .wig-controls {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }
  /* Glassmorphic Pill Buttons */
  .wig-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    color: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.85);
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.95);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .wig-btn:hover {
    background: rgba(255, 255, 255, 0.72);
    transform: translateY(-1px);
  }
  .wig-btn-active {
    background: rgba(253, 242, 248, 0.78);
    color: #e11d48;
    border-color: rgba(244, 63, 94, 0.6);
  }
  .wig-btn-gradient {
    color: #ffffff !important;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 6px 18px rgba(79, 70, 229, 0.25);
  }
  .wig-realm-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
    padding: 12px 0 8px 0;
    margin-bottom: 24px;
    scrollbar-width: none;
  }
  .wig-realm-bar::-webkit-scrollbar {
    display: none;
  }
  .wig-realm-chip {
    padding: 9px 18px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 800;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.35);
    color: #1e293b;
    backdrop-filter: blur(18px) saturate(180%);
    -webkit-backdrop-filter: blur(18px) saturate(180%);
    box-shadow: 0 4px 15px rgba(15, 23, 42, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.9);
    transition: all 0.25s ease;
  }
  .wig-realm-chip:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.65);
  }
  .wig-container {
    position: relative;
    z-index: 10;
    max-width: 880px;
    margin: 0 auto;
    padding: 36px 20px;
    transition: opacity 0.45s ease, transform 0.45s ease;
  }
  .wig-container-zen {
    opacity: 0.12;
    pointer-events: none;
  }
  .wig-hero-pill {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    padding: 8px 18px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.38);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.85);
    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.95);
    margin-bottom: 18px;
  }
  .wig-title {
    font-size: clamp(2.6rem, 6.5vw, 4.75rem);
    font-weight: 900;
    line-height: 1.08;
    letter-spacing: -0.03em;
    margin: 0 0 18px 0;
    background: linear-gradient(135deg, #0f172a 0%, #4f46e5 50%, #e11d48 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .wig-search-wrap {
    position: relative;
    margin-bottom: 32px;
  }
  .wig-search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #475569;
    pointer-events: none;
  }
  .wig-search-input {
    width: 100%;
    box-sizing: border-box;
    padding: 16px 20px 16px 50px;
    border-radius: 22px;
    border: 1px solid rgba(255, 255, 255, 0.88);
    background: rgba(255, 255, 255, 0.36);
    backdrop-filter: blur(22px) saturate(190%);
    -webkit-backdrop-filter: blur(22px) saturate(190%);
    color: #0f172a;
    font-size: 15px;
    font-weight: 600;
    box-shadow: 0 8px 28px -4px rgba(15, 23, 42, 0.06), inset 0 1px 2px rgba(255, 255, 255, 0.95);
    outline: none;
    transition: all 0.2s ease;
  }
  .wig-search-input:focus {
    background: rgba(255, 255, 255, 0.62);
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15), inset 0 1px 2px rgba(255, 255, 255, 1);
  }
  /* TRUE CRYSTAL GLASSMORPHISM STANZA CARDS */
  .wig-card {
    position: relative;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.44) 0%, rgba(255, 255, 255, 0.22) 100%);
    backdrop-filter: blur(24px) saturate(190%);
    -webkit-backdrop-filter: blur(24px) saturate(190%);
    border: 1px solid rgba(255, 255, 255, 0.82);
    border-radius: 28px;
    padding: 30px 64px 30px 30px;
    margin-bottom: 22px;
    box-shadow: 0 12px 36px -8px rgba(15, 23, 42, 0.07), inset 0 1px 2px rgba(255, 255, 255, 0.95);
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  }
  .wig-card:hover {
    transform: translateY(-3px);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.58) 0%, rgba(255, 255, 255, 0.34) 100%);
    box-shadow: 0 20px 44px -10px rgba(15, 23, 42, 0.11), inset 0 1px 2px rgba(255, 255, 255, 1);
  }
  .wig-card-chapter {
    border-width: 1.5px;
    padding-top: 34px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.56) 0%, rgba(255, 255, 255, 0.30) 100%);
  }
  .wig-chapter-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 5px 14px;
    border-radius: 999px;
    margin-bottom: 14px;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
  .wig-card-speaking {
    background: linear-gradient(135deg, rgba(253, 242, 248, 0.68) 0%, rgba(255, 255, 255, 0.42) 100%) !important;
    border-color: rgba(244, 63, 94, 0.75) !important;
    box-shadow: 0 16px 40px -8px rgba(225, 29, 72, 0.22), inset 0 1px 2px rgba(255, 255, 255, 1) !important;
  }
  .wig-card-text {
    white-space: pre-line;
    font-size: 19px;
    line-height: 1.8;
    color: #0f172a;
    font-weight: 600;
    margin: 0;
  }
  .wig-speak-btn {
    position: absolute;
    top: 22px;
    right: 22px;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(12px);
    color: #334155;
    border: 1px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.05);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .wig-speak-btn:hover {
    background: rgba(253, 242, 248, 0.85);
    color: #e11d48;
    border-color: #fecdd3;
    transform: scale(1.06);
  }
  .wig-speak-btn-active {
    background: #e11d48 !important;
    color: #ffffff !important;
    border-color: #e11d48 !important;
  }
  .wig-top-btn {
    position: fixed;
    bottom: 26px;
    right: 26px;
    z-index: 95;
    width: 50px;
    height: 50px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 28px rgba(79, 70, 229, 0.35);
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  .wig-top-btn:hover {
    transform: scale(1.08);
  }
`;

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lang, setLang] = useState('hi');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRealmIndex, setActiveRealmIndex] = useState(0);
  const [zenMode, setZenMode] = useState(false);

  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const isContinuousRef = useRef(false);
  const chapterRefs = useRef({});

  const [
    titleText,
    badgeText,
    subtitleBadge,
    searchPlaceholder,
    footerMantra,
    voiceOnLabel,
    voiceOffLabel,
    zenViewLabel,
    readingViewLabel,
    ...displayedParagraphs
  ] = parseBlocks(lang);

  const chapterStartIndices = useMemo(() => {
    const map = {};
    displayedParagraphs.forEach((para, idx) => {
      const rIdx = getRealmIndexForStanza(para);
      if (rIdx !== -1 && map[rIdx] === undefined) {
        map[rIdx] = idx;
      }
    });
    return map;
  }, [lang]);

  useEffect(() => {
    const onWindowScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);

      const ratio = progress / 100;
      if (ratio < 0.2) setActiveRealmIndex(0);
      else if (ratio < 0.42) setActiveRealmIndex(1);
      else if (ratio < 0.64) setActiveRealmIndex(2);
      else if (ratio < 0.78) setActiveRealmIndex(3);
      else if (ratio < 0.9) setActiveRealmIndex(4);
      else setActiveRealmIndex(5);
    };

    window.addEventListener('scroll', onWindowScroll, { passive: true });

    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        setVoices(window.speechSynthesis.getVoices());
      }
    };
    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      window.removeEventListener('scroll', onWindowScroll);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getFemaleVoice = (langCode) => {
    const targetPrefix = langCode === 'hi' ? 'hi' : 'en';
    const matchingLangVoices = voices.filter((v) =>
      v.lang.toLowerCase().startsWith(targetPrefix)
    );

    const femaleKeywords = [
      'female',
      'girl',
      'woman',
      'swara',
      'kalpana',
      'lekha',
      'heera',
      'zira',
      'samantha',
      'victoria',
      'aria',
      'jenny',
      'natasha',
      'neerja',
      'sangeeta',
      'google हिन्दी',
      'google uk english female',
      'google us english'
    ];

    const preferredFemale = matchingLangVoices.find((v) =>
      femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
    );

    return preferredFemale || matchingLangVoices[0] || voices[0] || null;
  };

  const speakParagraph = (index, continuous = false) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    isContinuousRef.current = continuous;

    const textToSpeak = displayedParagraphs[index];
    if (!textToSpeak) {
      setIsSpeaking(false);
      setActiveIndex(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const selectedVoice = getFemaleVoice(lang);
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.pitch = 1.1;
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setActiveIndex(index);
    };

    utterance.onend = () => {
      if (isContinuousRef.current && index + 1 < displayedParagraphs.length) {
        speakParagraph(index + 1, true);
      } else {
        setIsSpeaking(false);
        setActiveIndex(null);
        isContinuousRef.current = false;
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveIndex(null);
      isContinuousRef.current = false;
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    isContinuousRef.current = false;
    setIsSpeaking(false);
    setActiveIndex(null);
  };

  const toggleReadAll = () => {
    playUISound(640);
    if (isSpeaking) stopSpeech();
    else speakParagraph(activeIndex !== null ? activeIndex : 0, true);
  };

  const handleToggleLanguage = () => {
    playUISound(528);
    stopSpeech();
    setLang((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  const scrollToTop = () => {
    playUISound(720);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpToRealm = (realmIdx) => {
    playUISound(580);
    setActiveRealmIndex(realmIdx);
    const targetStanzaIdx = chapterStartIndices[realmIdx];
    if (targetStanzaIdx !== undefined && chapterRefs.current[targetStanzaIdx]) {
      chapterRefs.current[targetStanzaIdx].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const filteredStanzas = displayedParagraphs
    .map((para, index) => ({ para, index }))
    .filter((item) => item.para.toLowerCase().includes(searchTerm.toLowerCase()));

  const currentTheme = REALM_THEMES[activeRealmIndex] || REALM_THEMES[0];

  return (
    <div className="wig-page">
      <style>{CRYSTAL_GLASS_CSS}</style>

      {/* Ambient Color Glow Orbs behind Frosted Glass */}
      <div className="wig-aura-orb-1" style={{ background: currentTheme.blob1 }} />
      <div className="wig-aura-orb-2" style={{ background: currentTheme.blob2 }} />

      {/* 1. FIXED 3D SACRED MANDALA & MERKABA BACKGROUND */}
      <div className="wig-canvas-bg">
        <Canvas camera={{ position: [0, 0, 6.2], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-8, -8, 5]} intensity={1.3} color={currentTheme.primary} />
          <SacredMandala3D
            scrollProgress={scrollProgress}
            activeRealmIndex={activeRealmIndex}
            zenMode={zenMode}
          />
        </Canvas>
      </div>

      {/* 2. TOP READING PROGRESS BAR */}
      <div className="wig-progress-wrap">
        <div
          className="wig-progress-bar"
          style={{
            width: `${scrollProgress}%`,
            background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.secondary})`
          }}
        />
      </div>

      {/* 3. STICKY CRYSTAL GLASSMORPHISM NAVBAR */}
      <header className="wig-navbar">
        <div onClick={scrollToTop} className="wig-brand">
          <span className="wig-logo">ANANTA</span>
          <span
            className="wig-tag"
            style={{
              color: currentTheme.primary,
              background: 'rgba(255, 255, 255, 0.55)'
            }}
          >
            {lang === 'hi' ? currentTheme.hiName : currentTheme.enName}
          </span>
        </div>

        <div className="wig-controls">
          {/* Language Switcher: Click हिंदी -> Hindi, Click ENG -> English */}
          <button onClick={handleToggleLanguage} className="wig-btn">
            <Languages size={16} color={currentTheme.primary} />
            <span>{lang === 'en' ? 'हिंदी' : 'ENG'}</span>
          </button>

          {/* Girl Voice Read Aloud Button */}
          <button
            onClick={toggleReadAll}
            className={`wig-btn ${isSpeaking ? 'wig-btn-active' : ''}`}
          >
            {isSpeaking ? <Volume2 size={16} color="#e11d48" /> : <VolumeX size={16} />}
            <span>{isSpeaking ? voiceOnLabel : voiceOffLabel}</span>
          </button>

          {/* Sacred 3D Darshan / Zen View Toggle (Replaces 432Hz Button) */}
          <button
            onClick={() => {
              playUISound(620);
              setZenMode((prev) => !prev);
            }}
            className="wig-btn wig-btn-gradient"
            style={{
              background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.secondary})`
            }}
          >
            <Eye size={15} />
            <span>{zenMode ? readingViewLabel : zenViewLabel}</span>
          </button>
        </div>
      </header>

      {/* 4. MAIN SCROLLABLE SPIRITUAL CONTENT */}
      <main className={`wig-container ${zenMode ? 'wig-container-zen' : ''}`}>
        {/* Hero Section */}
        <div>
          <div onClick={() => playUISound(600)} className="wig-hero-pill">
            <Sparkles size={15} color={currentTheme.primary} />
            <span style={{ fontSize: '12px', fontWeight: 800, color: currentTheme.primary }}>
              {badgeText}
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              {subtitleBadge}
            </span>
          </div>

          <h1 className="wig-title">{titleText}</h1>
        </div>

        {/* Interactive 6-Deity Realm Quick-Jump Glass Bar */}
        <div className="wig-realm-bar">
          {REALM_THEMES.map((realm, idx) => {
            const isActive = activeRealmIndex === idx;
            return (
              <button
                key={realm.id}
                onClick={() => jumpToRealm(idx)}
                className="wig-realm-chip"
                style={
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${realm.primary}, ${realm.secondary})`,
                        color: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.7)',
                        boxShadow: `0 8px 20px -4px ${realm.borderGlow}`
                      }
                    : {}
                }
              >
                {lang === 'hi' ? realm.hiName : realm.enName}
              </button>
            );
          })}
        </div>

        {/* Translucent Glass Search Input */}
        <div className="wig-search-wrap">
          <Search size={19} className="wig-search-icon" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="wig-search-input"
          />
        </div>

        {/* Crystal Glass Stanza Cards */}
        <div>
          {filteredStanzas.map(({ para, index }) => {
            const isCurrentSpeaking = isSpeaking && activeIndex === index;
            const chapterRealmIdx = getRealmIndexForStanza(para);
            const isChapterStart = chapterRealmIdx !== -1;
            const chapterTheme = isChapterStart ? REALM_THEMES[chapterRealmIdx] : null;

            return (
              <div
                key={index}
                ref={(el) => {
                  if (isChapterStart) chapterRefs.current[index] = el;
                }}
                className={`wig-card ${isChapterStart ? 'wig-card-chapter' : ''} ${
                  isCurrentSpeaking ? 'wig-card-speaking' : ''
                }`}
                style={
                  isChapterStart
                    ? {
                        borderColor: chapterTheme.borderGlow
                      }
                    : {}
                }
              >
                {isChapterStart && (
                  <div
                    className="wig-chapter-badge"
                    style={{
                      background: `linear-gradient(90deg, ${chapterTheme.primary}, ${chapterTheme.secondary})`
                    }}
                  >
                    <Sparkles size={12} />
                    <span>
                      {lang === 'hi' ? chapterTheme.hiName : chapterTheme.enName}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => {
                    playUISound(660);
                    isCurrentSpeaking ? stopSpeech() : speakParagraph(index, false);
                  }}
                  className={`wig-speak-btn ${
                    isCurrentSpeaking ? 'wig-speak-btn-active' : ''
                  }`}
                  title={isCurrentSpeaking ? 'Stop speaking' : 'Listen to this stanza'}
                >
                  {isCurrentSpeaking ? <VolumeX size={17} /> : <Volume2 size={17} />}
                </button>

                <p className="wig-card-text">{para}</p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer
          onClick={() => playUISound(528)}
          style={{
            marginTop: '54px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              padding: '12px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.85)',
              color: currentTheme.primary
            }}
          >
            <BookOpen size={22} />
          </div>
          <p
            style={{
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#334155',
              margin: 0
            }}
          >
            {footerMantra}
          </p>
        </footer>
      </main>

      {/* Scroll to Top Button */}
      {scrollProgress > 10 && (
        <button
          onClick={scrollToTop}
          className="wig-top-btn"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}