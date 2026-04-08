/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Activity,
  Info,
  Zap,
  RefreshCw,
  ArrowLeft,
  ChevronRight,
  Layers,
  ListOrdered,
  Monitor,
  Cpu,
  Code2,
  Binary,
  Terminal
} from 'lucide-react';

// --- Types ---
type Algorithm = 'bubble' | 'insertion' | 'selection' | 'quick' | 'merge' | 'heap' | 'interchange';

interface ArrayElement {
  id: string;
  value: number;
  status: 'default' | 'comparing' | 'swapping' | 'sorted' | 'active';
  swapDirection: 'up' | 'down' | null;
}

interface StepInfo {
  message: string;
  type: 'info' | 'compare' | 'swap' | 'done';
}

export default function App() {
  const [view, setView] = useState<'home' | 'visualizer'>('home');
  const [selectedAlgo, setSelectedAlgo] = useState<Algorithm>('bubble');

  if (view === 'home') {
    return <Home onSelect={(algo) => { setSelectedAlgo(algo); setView('visualizer'); }} />;
  }

  return <Visualizer algorithm={selectedAlgo} onBack={() => setView('home')} />;
}

// --- Home Component ---

function Home({ onSelect }: { onSelect: (algo: Algorithm) => void }) {
  const algos = [
    { 
      id: 'bubble' as Algorithm, 
      name: 'Sắp xếp nổi bọt', 
      desc: 'Bubble Sort', 
      icon: <Zap className="text-yellow-400" />, 
      color: 'from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-500/30',
      detail: 'So sánh các cặp kề nhau và hoán đổi nếu sai thứ tự.'
    },
    { 
      id: 'insertion' as Algorithm, 
      name: 'Sắp xếp chèn', 
      desc: 'Insertion Sort', 
      icon: <Layers className="text-blue-400" />, 
      color: 'from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-500/30',
      detail: 'Xây dựng dãy con đã sắp xếp bằng cách chèn từng phần tử vào đúng vị trí.'
    },
    { 
      id: 'selection' as Algorithm, 
      name: 'Sắp xếp chọn', 
      desc: 'Selection Sort', 
      icon: <ListOrdered className="text-emerald-400" />, 
      color: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      detail: 'Tìm phần tử nhỏ nhất trong phần chưa sắp xếp và đưa về đầu.'
    },
    { 
      id: 'quick' as Algorithm, 
      name: 'Sắp xếp nhanh', 
      desc: 'Quick Sort', 
      icon: <Cpu className="text-rose-400" />, 
      color: 'from-rose-500/20 to-red-500/20',
      border: 'border-rose-500/30',
      detail: 'Chia để trị: chọn chốt và phân đoạn mảng thành hai phần.'
    },
    { 
      id: 'merge' as Algorithm, 
      name: 'Sắp xếp trộn', 
      desc: 'Merge Sort', 
      icon: <Binary className="text-purple-400" />, 
      color: 'from-purple-500/20 to-fuchsia-500/20',
      border: 'border-purple-500/30',
      detail: 'Chia mảng thành các mảng con và trộn chúng lại theo thứ tự.'
    },
    { 
      id: 'heap' as Algorithm, 
      name: 'Sắp xếp vun đống', 
      desc: 'Heap Sort', 
      icon: <Monitor className="text-orange-400" />, 
      color: 'from-orange-500/20 to-amber-500/20',
      border: 'border-orange-500/30',
      detail: 'Sử dụng cấu trúc dữ liệu Heap để tìm phần tử lớn nhất.'
    },
    { 
      id: 'interchange' as Algorithm, 
      name: 'Đổi chỗ trực tiếp', 
      desc: 'Interchange Sort', 
      icon: <RefreshCw className="text-cyan-400" />, 
      color: 'from-cyan-500/20 to-blue-500/20',
      border: 'border-cyan-500/30',
      detail: 'So sánh phần tử hiện tại với tất cả các phần tử phía sau và hoán đổi ngay nếu sai thứ tự.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white font-sans p-4 md:p-6 overflow-y-auto flex items-center justify-center relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
        {/* Floating Binary Strings */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`binary-${i}`}
            initial={{ y: '110vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
            animate={{ 
              y: '-10vh', 
              opacity: [0, 0.5, 0],
            }}
            transition={{ 
              duration: 15 + Math.random() * 20, 
              repeat: Infinity, 
              delay: Math.random() * 10,
              ease: "linear"
            }}
            className="absolute text-blue-500/40 font-mono text-sm tracking-widest select-none"
          >
            {Math.random() > 0.5 ? '10101101' : '01101001'}
          </motion.div>
        ))}

        {/* Floating Icons */}
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 left-[10%] text-blue-500/20"><Monitor size={120} /></motion.div>
        <motion.div animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-20 right-[10%] text-emerald-500/20"><Cpu size={140} /></motion.div>
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 right-[5%] text-indigo-500/20"><Code2 size={100} /></motion.div>
        <motion.div animate={{ x: [0, 15, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-1/4 left-[5%] text-blue-400/10"><Terminal size={80} /></motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl w-full bg-slate-900/40 backdrop-blur-3xl border border-slate-800/60 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden z-10 my-8"
      >
        {/* Decorative background elements inside the frame */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Binary bit decorations inside the frame */}
        <div className="absolute top-12 right-12 flex gap-4 opacity-[0.07] font-mono text-[9px] select-none pointer-events-none tracking-[0.5em]">
          <div className="flex flex-col"><span>1</span><span>0</span><span>1</span><span>1</span><span>0</span><span>1</span><span>0</span><span>1</span></div>
          <div className="flex flex-col"><span>0</span><span>1</span><span>1</span><span>0</span><span>1</span><span>0</span><span>1</span><span>1</span></div>
          <div className="flex flex-col"><span>1</span><span>1</span><span>0</span><span>0</span><span>1</span><span>1</span><span>0</span><span>0</span></div>
        </div>
        <div className="absolute bottom-12 left-12 flex gap-4 opacity-[0.07] font-mono text-[9px] select-none pointer-events-none tracking-[0.5em]">
          <div className="flex flex-col"><span>0</span><span>0</span><span>1</span><span>0</span><span>1</span><span>1</span><span>1</span><span>0</span></div>
          <div className="flex flex-col"><span>1</span><span>1</span><span>0</span><span>1</span><span>0</span><span>0</span><span>0</span><span>1</span></div>
          <div className="flex flex-col"><span>0</span><span>1</span><span>1</span><span>1</span><span>0</span><span>1</span><span>1</span><span>1</span></div>
        </div>
        <div className="absolute top-1/2 -left-4 -translate-y-1/2 flex flex-col gap-2 opacity-[0.05] font-mono text-[8px] select-none pointer-events-none tracking-[0.8em]">
          <div>1010101010101010</div>
          <div>0101010101010101</div>
        </div>
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 flex flex-col gap-2 opacity-[0.05] font-mono text-[8px] select-none pointer-events-none tracking-[0.8em]">
          <div>1111000011110000</div>
          <div>0000111100001111</div>
        </div>

        <div className="relative z-10 space-y-8 md:space-y-12">
          <header className="text-center mb-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4 md:mb-8"
            >
              Các thuật toán sắp xếp cơ bản
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto"
            >
              Chọn một thuật toán để bắt đầu khám phá cách thức hoạt động của chúng thông qua các mô phỏng tương tác.
            </motion.p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {algos.map((algo, idx) => (
              <motion.button
                key={algo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{ delay: 0.1 * (idx + 1), type: "spring", stiffness: 300 }}
                onClick={() => onSelect(algo.id)}
                className={`group relative p-8 rounded-[2.5rem] bg-gradient-to-br ${algo.color} border-2 ${algo.border} backdrop-blur-xl text-left transition-all hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400/50 cursor-pointer`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-slate-900/60 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {algo.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">{algo.name}</h3>
                    <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">{algo.desc}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                  {algo.detail}
                </p>
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm group-hover:translate-x-2 transition-transform">
                  Bắt đầu khám phá <ChevronRight size={16} />
                </div>
                
                {/* Subtle background glow on hover */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.button>
            ))}
          </div>

          <footer className="text-center text-slate-500 text-xs pt-8">
            Thiết kế bởi Khoa CNTT <span className="mx-2 text-blue-400/40">•</span> 2026
          </footer>
        </div>
      </motion.div>
    </div>
  );
}

// --- Visualizer Component ---

function Visualizer({ algorithm, onBack }: { algorithm: Algorithm, onBack: () => void }) {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [stats, setStats] = useState({ passes: 0, swaps: 0, comparisons: 0 });
  const [currentStep, setCurrentStep] = useState<StepInfo | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const isPausedRef = useRef(false);
  const stopRef = useRef(false);
  const speedRef = useRef(500);
  const executionIdRef = useRef(0);

  const generateArray = useCallback((inputStr?: string) => {
    let values: number[] = [];
    const defaultLength = algorithm === 'bubble' ? 8 : 10;
    if (inputStr && inputStr.trim() !== "") {
      values = inputStr.split(/[\s,]+/).map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    } else {
      values = Array.from({ length: defaultLength }, () => Math.floor(Math.random() * 90) + 10);
    }
    if (values.length === 0) values = Array.from({ length: defaultLength }, () => Math.floor(Math.random() * 90) + 10);

    const timestamp = Date.now();
    const newArray: ArrayElement[] = values.map((val, idx) => ({
      id: `${timestamp}-${idx}`,
      value: val,
      status: 'default',
      swapDirection: null
    }));
    
    setArray(newArray);
    setStats({ passes: 0, swaps: 0, comparisons: 0 });
    setCurrentStep({ message: "Sẵn sàng để bắt đầu!", type: 'info' });
    setIsSorting(false);
    setIsPaused(false);
    stopRef.current = false;
    isPausedRef.current = false;
  }, [algorithm]);

  useEffect(() => {
    generateArray();
    return () => { stopRef.current = true; };
  }, [generateArray]);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const waitControl = async () => { while (isPausedRef.current && !stopRef.current) await sleep(100); };

  // --- Sorting Logics ---

  const bubbleSort = async (myId: number) => {
    let tempArray = [...array].map(el => ({ ...el, status: 'default' as const, swapDirection: null as any }));
    let n = tempArray.length;
    let localSwaps = 0, localComparisons = 0, localPasses = 0;

    for (let i = 0; i < n; i++) {
      localPasses++;
      setStats(prev => ({ ...prev, passes: localPasses }));
      let swapped = false;
      // Bubble from bottom up to i
      for (let j = n - 1; j > i; j--) {
        if (stopRef.current || executionIdRef.current !== myId) return;
        
        // Comparing j and j-1
        tempArray[j].status = 'comparing';
        tempArray[j - 1].status = 'comparing';
        setArray([...tempArray]);
        localComparisons++;
        setStats(prev => ({ ...prev, comparisons: localComparisons }));
        setCurrentStep({ message: `So sánh ${tempArray[j].value} và ${tempArray[j - 1].value}`, type: 'compare' });
        await sleep(speedRef.current); await waitControl();
        if (stopRef.current || executionIdRef.current !== myId) return;

        const shouldSwap = sortOrder === 'asc' 
          ? tempArray[j].value < tempArray[j - 1].value 
          : tempArray[j].value > tempArray[j - 1].value;

        if (shouldSwap) {
          tempArray[j].status = 'swapping'; tempArray[j - 1].status = 'swapping';
          tempArray[j].swapDirection = 'up'; tempArray[j - 1].swapDirection = 'down';
          setArray([...tempArray]);
          setCurrentStep({ message: `${tempArray[j].value} ${sortOrder === 'asc' ? '<' : '>'} ${tempArray[j - 1].value} → Hoán đổi (nổi lên)`, type: 'swap' });
          await sleep(speedRef.current * 0.5); await waitControl();
          if (stopRef.current || executionIdRef.current !== myId) return;

          const temp = tempArray[j]; tempArray[j] = tempArray[j - 1]; tempArray[j - 1] = temp;
          localSwaps++; setStats(prev => ({ ...prev, swaps: localSwaps }));
          setArray([...tempArray]);
          await sleep(speedRef.current * 0.8); await waitControl();
          if (stopRef.current || executionIdRef.current !== myId) return;

          tempArray[j].swapDirection = null; tempArray[j - 1].swapDirection = null;
          setArray([...tempArray]);
          swapped = true;
          await sleep(speedRef.current * 0.5); await waitControl();
        }
        tempArray[j].status = 'default'; tempArray[j - 1].status = 'default';
        setArray([...tempArray]);
      }
      tempArray[i].status = 'sorted'; setArray([...tempArray]);
      if (!swapped) {
        for (let k = i + 1; k < n; k++) tempArray[k].status = 'sorted';
        setArray([...tempArray]); break;
      }
    }
  };

  const selectionSort = async (myId: number) => {
    let tempArray = [...array].map(el => ({ ...el, status: 'default' as const, swapDirection: null as any }));
    let n = tempArray.length;
    let localSwaps = 0, localComparisons = 0, localPasses = 0;

    for (let i = 0; i < n - 1; i++) {
      localPasses++;
      setStats(prev => ({ ...prev, passes: localPasses }));
      let minIdx = i;
      tempArray[i].status = 'active';
      setArray([...tempArray]);
      setCurrentStep({ message: `Tìm phần tử ${sortOrder === 'asc' ? 'nhỏ nhất' : 'lớn nhất'} từ vị trí ${i}`, type: 'info' });
      await sleep(speedRef.current); await waitControl();

      for (let j = i + 1; j < n; j++) {
        if (stopRef.current || executionIdRef.current !== myId) return;
        tempArray[j].status = 'comparing';
        setArray([...tempArray]);
        localComparisons++;
        setStats(prev => ({ ...prev, comparisons: localComparisons }));
        await sleep(speedRef.current * 0.5); await waitControl();

        const isBetter = sortOrder === 'asc' ? tempArray[j].value < tempArray[minIdx].value : tempArray[j].value > tempArray[minIdx].value;
        if (isBetter) {
          if (minIdx !== i) tempArray[minIdx].status = 'default';
          minIdx = j;
          tempArray[minIdx].status = 'active';
          setCurrentStep({ message: `Đã tìm thấy giá trị ${sortOrder === 'asc' ? 'nhỏ hơn' : 'lớn hơn'}: ${tempArray[minIdx].value}`, type: 'compare' });
        } else {
          tempArray[j].status = 'default';
        }
        setArray([...tempArray]);
      }

      if (minIdx !== i) {
        setCurrentStep({ message: `Hoán đổi ${tempArray[i].value} và ${tempArray[minIdx].value}`, type: 'swap' });
        tempArray[i].status = 'swapping'; tempArray[minIdx].status = 'swapping';
        tempArray[i].swapDirection = 'up'; tempArray[minIdx].swapDirection = 'down';
        setArray([...tempArray]);
        await sleep(speedRef.current * 0.5); await waitControl();
        
        const temp = tempArray[i]; tempArray[i] = tempArray[minIdx]; tempArray[minIdx] = temp;
        localSwaps++; setStats(prev => ({ ...prev, swaps: localSwaps }));
        setArray([...tempArray]);
        await sleep(speedRef.current * 0.8); await waitControl();
        
        tempArray[i].swapDirection = null; tempArray[minIdx].swapDirection = null;
      }
      
      tempArray[i].status = 'sorted';
      if (minIdx !== i) tempArray[minIdx].status = 'default';
      setArray([...tempArray]);
    }
    tempArray[n - 1].status = 'sorted';
    setArray([...tempArray]);
  };

  const insertionSort = async (myId: number) => {
    let tempArray = [...array].map(el => ({ ...el, status: 'default' as const, swapDirection: null as any }));
    let n = tempArray.length;
    let localSwaps = 0, localComparisons = 0, localPasses = 0;

    tempArray[0].status = 'sorted';
    setArray([...tempArray]);

    for (let i = 1; i < n; i++) {
      localPasses++;
      setStats(prev => ({ ...prev, passes: localPasses }));
      
      // Highlight the element being inserted
      tempArray[i].status = 'active';
      setArray([...tempArray]);
      setCurrentStep({ message: `Đang xét phần tử ${tempArray[i].value}`, type: 'info' });
      await sleep(speedRef.current); await waitControl();

      let j = i;
      while (j > 0) {
        if (stopRef.current || executionIdRef.current !== myId) return;
        
        // Compare j and j-1
        tempArray[j].status = 'active';
        tempArray[j-1].status = 'comparing';
        setArray([...tempArray]);
        localComparisons++;
        setStats(prev => ({ ...prev, comparisons: localComparisons }));
        setCurrentStep({ message: `So sánh ${tempArray[j].value} và ${tempArray[j-1].value}`, type: 'compare' });
        await sleep(speedRef.current); await waitControl();

        const shouldSwap = sortOrder === 'asc' 
          ? tempArray[j-1].value > tempArray[j].value 
          : tempArray[j-1].value < tempArray[j].value;

        if (shouldSwap) {
          setCurrentStep({ message: `${tempArray[j-1].value} ${sortOrder === 'asc' ? '>' : '<'} ${tempArray[j].value} → Hoán đổi`, type: 'swap' });
          
          tempArray[j].status = 'swapping';
          tempArray[j-1].status = 'swapping';
          tempArray[j].swapDirection = 'up';
          tempArray[j-1].swapDirection = 'down';
          setArray([...tempArray]);
          await sleep(speedRef.current * 0.5); await waitControl();
          if (stopRef.current || executionIdRef.current !== myId) return;

          // Perform swap
          const temp = tempArray[j];
          tempArray[j] = tempArray[j-1];
          tempArray[j-1] = temp;
          
          localSwaps++;
          setStats(prev => ({ ...prev, swaps: localSwaps }));
          setArray([...tempArray]);
          await sleep(speedRef.current * 0.8); await waitControl();
          if (stopRef.current || executionIdRef.current !== myId) return;

          tempArray[j].swapDirection = null;
          tempArray[j-1].swapDirection = null;
          tempArray[j].status = 'sorted'; // The one that moved right is part of sorted section
          tempArray[j-1].status = 'active'; // The key continues moving left
          setArray([...tempArray]);
          j--;
        } else {
          tempArray[j].status = 'sorted';
          tempArray[j-1].status = 'sorted';
          setArray([...tempArray]);
          break;
        }
      }
      
      // Finalize the pass
      for(let k = 0; k <= i; k++) {
        tempArray[k].status = 'sorted';
      }
      setArray([...tempArray]);
    }
  };

  const quickSort = async (myId: number) => {
    let tempArray = [...array].map(el => ({ ...el, status: 'default' as const, swapDirection: null as any }));
    let localSwaps = 0, localComparisons = 0, localPasses = 0;

    const partition = async (low: number, high: number) => {
      let pivot = tempArray[high].value;
      tempArray[high].status = 'active';
      setArray([...tempArray]);
      setCurrentStep({ message: `Chọn chốt (pivot): ${pivot}`, type: 'info' });
      await sleep(speedRef.current); await waitControl();

      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (stopRef.current || executionIdRef.current !== myId) return -1;
        
        tempArray[j].status = 'comparing';
        setArray([...tempArray]);
        localComparisons++;
        setStats(prev => ({ ...prev, comparisons: localComparisons }));
        setCurrentStep({ message: `So sánh ${tempArray[j].value} với chốt ${pivot}`, type: 'compare' });
        await sleep(speedRef.current * 0.5); await waitControl();

        const condition = sortOrder === 'asc' ? tempArray[j].value < pivot : tempArray[j].value > pivot;
        if (condition) {
          i++;
          tempArray[i].status = 'swapping';
          tempArray[j].status = 'swapping';
          tempArray[i].swapDirection = 'up';
          tempArray[j].swapDirection = 'down';
          setArray([...tempArray]);
          setCurrentStep({ message: `${tempArray[j].value} ${sortOrder === 'asc' ? '<' : '>'} ${pivot} → Hoán đổi vào vùng bên trái`, type: 'swap' });
          await sleep(speedRef.current * 0.5); await waitControl();

          const temp = tempArray[i];
          tempArray[i] = tempArray[j];
          tempArray[j] = temp;
          localSwaps++;
          setStats(prev => ({ ...prev, swaps: localSwaps }));
          setArray([...tempArray]);
          await sleep(speedRef.current * 0.8); await waitControl();
          
          tempArray[i].swapDirection = null;
          tempArray[j].swapDirection = null;
          tempArray[i].status = 'default';
          tempArray[j].status = 'default';
        } else {
          tempArray[j].status = 'default';
        }
        setArray([...tempArray]);
      }

      // Swap pivot
      const pivotIdx = i + 1;
      tempArray[pivotIdx].status = 'swapping';
      tempArray[high].status = 'swapping';
      tempArray[pivotIdx].swapDirection = 'up';
      tempArray[high].swapDirection = 'down';
      setArray([...tempArray]);
      setCurrentStep({ message: `Đưa chốt ${pivot} về đúng vị trí`, type: 'swap' });
      await sleep(speedRef.current * 0.5); await waitControl();

      const temp = tempArray[pivotIdx];
      tempArray[pivotIdx] = tempArray[high];
      tempArray[high] = temp;
      localSwaps++;
      setStats(prev => ({ ...prev, swaps: localSwaps }));
      setArray([...tempArray]);
      await sleep(speedRef.current * 0.8); await waitControl();

      tempArray[pivotIdx].status = 'sorted';
      tempArray[pivotIdx].swapDirection = null;
      tempArray[high].swapDirection = null;
      tempArray[high].status = 'default';
      setArray([...tempArray]);
      return pivotIdx;
    };

    const sort = async (low: number, high: number) => {
      if (low < high) {
        localPasses++;
        setStats(prev => ({ ...prev, passes: localPasses }));
        let pi = await partition(low, high);
        if (pi === -1) return;
        await sort(low, pi - 1);
        await sort(pi + 1, high);
      } else if (low === high) {
        tempArray[low].status = 'sorted';
        setArray([...tempArray]);
      }
    };

    await sort(0, tempArray.length - 1);
    tempArray.forEach(el => el.status = 'sorted');
    setArray([...tempArray]);
  };

  const mergeSort = async (myId: number) => {
    let tempArray = [...array].map(el => ({ ...el, status: 'default' as const, swapDirection: null as any }));
    let localComparisons = 0, localPasses = 0;

    const merge = async (l: number, m: number, r: number) => {
      let n1 = m - l + 1;
      let n2 = r - m;
      let L = tempArray.slice(l, m + 1);
      let R = tempArray.slice(m + 1, r + 1);

      setCurrentStep({ message: `Trộn hai mảng con: [${L.map(x => x.value).join(', ')}] và [${R.map(x => x.value).join(', ')}]`, type: 'info' });
      
      // Highlight merging area
      for (let k = l; k <= r; k++) tempArray[k].status = 'active';
      setArray([...tempArray]);
      await sleep(speedRef.current); await waitControl();

      let i = 0, j = 0, k = l;
      while (i < n1 && j < n2) {
        if (stopRef.current || executionIdRef.current !== myId) return;
        
        localComparisons++;
        setStats(prev => ({ ...prev, comparisons: localComparisons }));
        setCurrentStep({ message: `So sánh ${L[i].value} và ${R[j].value}`, type: 'compare' });
        await sleep(speedRef.current * 0.5); await waitControl();

        const condition = sortOrder === 'asc' ? L[i].value <= R[j].value : L[i].value >= R[j].value;
        if (condition) {
          tempArray[k] = { ...L[i], status: 'swapping', swapDirection: 'up' };
          i++;
        } else {
          tempArray[k] = { ...R[j], status: 'swapping', swapDirection: 'down' };
          j++;
        }
        setArray([...tempArray]);
        await sleep(speedRef.current * 0.8); await waitControl();
        tempArray[k].status = 'sorted';
        tempArray[k].swapDirection = null;
        setArray([...tempArray]);
        k++;
      }

      while (i < n1) {
        if (stopRef.current || executionIdRef.current !== myId) return;
        tempArray[k] = { ...L[i], status: 'swapping', swapDirection: 'up' };
        setArray([...tempArray]);
        await sleep(speedRef.current * 0.5); await waitControl();
        tempArray[k].status = 'sorted';
        tempArray[k].swapDirection = null;
        setArray([...tempArray]);
        i++; k++;
      }

      while (j < n2) {
        if (stopRef.current || executionIdRef.current !== myId) return;
        tempArray[k] = { ...R[j], status: 'swapping', swapDirection: 'down' };
        setArray([...tempArray]);
        await sleep(speedRef.current * 0.5); await waitControl();
        tempArray[k].status = 'sorted';
        tempArray[k].swapDirection = null;
        setArray([...tempArray]);
        j++; k++;
      }
    };

    const sort = async (l: number, r: number) => {
      if (l < r) {
        localPasses++;
        setStats(prev => ({ ...prev, passes: localPasses }));
        let m = Math.floor((l + r) / 2);
        await sort(l, m);
        await sort(m + 1, r);
        await merge(l, m, r);
      }
    };

    await sort(0, tempArray.length - 1);
    tempArray.forEach(el => el.status = 'sorted');
    setArray([...tempArray]);
  };

  const heapSort = async (myId: number) => {
    let tempArray = [...array].map(el => ({ ...el, status: 'default' as const, swapDirection: null as any }));
    let n = tempArray.length;
    let localSwaps = 0, localComparisons = 0, localPasses = 0;

    const heapify = async (n: number, i: number) => {
      let largest = i;
      let l = 2 * i + 1;
      let r = 2 * i + 2;

      tempArray[i].status = 'active';
      setArray([...tempArray]);

      if (l < n) {
        localComparisons++;
        setStats(prev => ({ ...prev, comparisons: localComparisons }));
        const condition = sortOrder === 'asc' ? tempArray[l].value > tempArray[largest].value : tempArray[l].value < tempArray[largest].value;
        if (condition) largest = l;
      }

      if (r < n) {
        localComparisons++;
        setStats(prev => ({ ...prev, comparisons: localComparisons }));
        const condition = sortOrder === 'asc' ? tempArray[r].value > tempArray[largest].value : tempArray[r].value < tempArray[largest].value;
        if (condition) largest = r;
      }

      if (largest !== i) {
        tempArray[i].status = 'swapping';
        tempArray[largest].status = 'swapping';
        tempArray[i].swapDirection = i < largest ? 'up' : 'down';
        tempArray[largest].swapDirection = i < largest ? 'down' : 'up';
        setArray([...tempArray]);
        setCurrentStep({ message: `Vun đống: Hoán đổi ${tempArray[i].value} và ${tempArray[largest].value}`, type: 'swap' });
        await sleep(speedRef.current * 0.5); await waitControl();

        const temp = tempArray[i];
        tempArray[i] = tempArray[largest];
        tempArray[largest] = temp;
        localSwaps++;
        setStats(prev => ({ ...prev, swaps: localSwaps }));
        setArray([...tempArray]);
        await sleep(speedRef.current * 0.8); await waitControl();

        tempArray[i].swapDirection = null;
        tempArray[largest].swapDirection = null;
        tempArray[i].status = 'default';
        tempArray[largest].status = 'default';
        await heapify(n, largest);
      } else {
        tempArray[i].status = 'default';
        setArray([...tempArray]);
      }
    };

    // Build heap
    setCurrentStep({ message: "Xây dựng cấu trúc Heap ban đầu", type: 'info' });
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      if (stopRef.current || executionIdRef.current !== myId) return;
      await heapify(n, i);
    }

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
      if (stopRef.current || executionIdRef.current !== myId) return;
      localPasses++;
      setStats(prev => ({ ...prev, passes: localPasses }));

      setCurrentStep({ message: `Đưa phần tử ${sortOrder === 'asc' ? 'lớn nhất' : 'nhỏ nhất'} ${tempArray[0].value} về cuối`, type: 'swap' });
      tempArray[0].status = 'swapping';
      tempArray[i].status = 'swapping';
      tempArray[0].swapDirection = 'up';
      tempArray[i].swapDirection = 'down';
      setArray([...tempArray]);
      await sleep(speedRef.current * 0.5); await waitControl();

      const temp = tempArray[0];
      tempArray[0] = tempArray[i];
      tempArray[i] = temp;
      localSwaps++;
      setStats(prev => ({ ...prev, swaps: localSwaps }));
      setArray([...tempArray]);
      await sleep(speedRef.current * 0.8); await waitControl();

      tempArray[i].status = 'sorted';
      tempArray[i].swapDirection = null;
      tempArray[0].swapDirection = null;
      tempArray[0].status = 'default';
      setArray([...tempArray]);
      await heapify(i, 0);
    }
    tempArray[0].status = 'sorted';
    setArray([...tempArray]);
  };

  const interchangeSort = async (myId: number) => {
    let tempArray = [...array].map(el => ({ ...el, status: 'default' as const, swapDirection: null as any }));
    let n = tempArray.length;
    let localSwaps = 0, localComparisons = 0, localPasses = 0;

    for (let i = 0; i < n - 1; i++) {
      localPasses++;
      setStats(prev => ({ ...prev, passes: localPasses }));
      tempArray[i].status = 'active';
      setArray([...tempArray]);
      setCurrentStep({ message: `Xét phần tử tại vị trí ${i}`, type: 'info' });
      await sleep(speedRef.current); await waitControl();

      for (let j = i + 1; j < n; j++) {
        if (stopRef.current || executionIdRef.current !== myId) return;
        
        tempArray[j].status = 'comparing';
        setArray([...tempArray]);
        localComparisons++;
        setStats(prev => ({ ...prev, comparisons: localComparisons }));
        setCurrentStep({ message: `So sánh ${tempArray[i].value} và ${tempArray[j].value}`, type: 'compare' });
        await sleep(speedRef.current * 0.5); await waitControl();

        const shouldSwap = sortOrder === 'asc' 
          ? tempArray[j].value < tempArray[i].value 
          : tempArray[j].value > tempArray[i].value;

        if (shouldSwap) {
          setCurrentStep({ message: `${tempArray[j].value} ${sortOrder === 'asc' ? '<' : '>'} ${tempArray[i].value} → Hoán đổi ngay`, type: 'swap' });
          tempArray[i].status = 'swapping';
          tempArray[j].status = 'swapping';
          tempArray[i].swapDirection = 'up';
          tempArray[j].swapDirection = 'down';
          setArray([...tempArray]);
          await sleep(speedRef.current * 0.5); await waitControl();
          if (stopRef.current || executionIdRef.current !== myId) return;

          const temp = tempArray[i];
          tempArray[i] = tempArray[j];
          tempArray[j] = temp;
          localSwaps++;
          setStats(prev => ({ ...prev, swaps: localSwaps }));
          setArray([...tempArray]);
          await sleep(speedRef.current * 0.8); await waitControl();
          if (stopRef.current || executionIdRef.current !== myId) return;

          tempArray[i].swapDirection = null;
          tempArray[j].swapDirection = null;
          tempArray[i].status = 'active';
          tempArray[j].status = 'default';
          setArray([...tempArray]);
        } else {
          tempArray[j].status = 'default';
          setArray([...tempArray]);
        }
      }
      tempArray[i].status = 'sorted';
      setArray([...tempArray]);
    }
    tempArray[n - 1].status = 'sorted';
    setArray([...tempArray]);
  };

  const startSort = async () => {
    if (isSorting) return;
    const myId = ++executionIdRef.current;
    setIsSorting(true); setIsPaused(false); isPausedRef.current = false; stopRef.current = false;
    try {
      if (algorithm === 'bubble') await bubbleSort(myId);
      else if (algorithm === 'selection') await selectionSort(myId);
      else if (algorithm === 'insertion') await insertionSort(myId);
      else if (algorithm === 'quick') await quickSort(myId);
      else if (algorithm === 'merge') await mergeSort(myId);
      else if (algorithm === 'heap') await heapSort(myId);
      else if (algorithm === 'interchange') await interchangeSort(myId);
      if (!stopRef.current && executionIdRef.current === myId) setCurrentStep({ message: "Hoàn tất sắp xếp!", type: 'done' });
    } finally { if (executionIdRef.current === myId) setIsSorting(false); }
  };

  const handleReset = () => { executionIdRef.current++; stopRef.current = true; isPausedRef.current = false; setIsPaused(false); generateArray(customInput); };
  const handleRandomize = () => { executionIdRef.current++; stopRef.current = true; isPausedRef.current = false; setIsPaused(false); setCustomInput(''); generateArray(); };

  const getPseudoCode = () => {
    if (algorithm === 'bubble') return (
      <>
        <p className={currentStep?.type === 'compare' ? 'text-yellow-400 font-bold' : ''}>if (a[j] {sortOrder === 'asc' ? '>' : '<'} a[j+1]) &#123;</p>
        <p className={`pl-3 ${currentStep?.type === 'swap' ? 'text-orange-400 font-bold' : ''}`}>swap(a[j], a[j+1]);</p>
        <p>&#125;</p>
      </>
    );
    if (algorithm === 'selection') return (
      <>
        <p className={currentStep?.type === 'compare' ? 'text-yellow-400 font-bold' : ''}>if (a[j] {sortOrder === 'asc' ? '<' : '>'} a[minIdx]) &#123;</p>
        <p className="pl-3">minIdx = j;</p>
        <p>&#125;</p>
        <p className={currentStep?.type === 'swap' ? 'text-orange-400 font-bold' : ''}>swap(a[i], a[minIdx]);</p>
      </>
    );
    if (algorithm === 'insertion') return (
      <>
        <p className={currentStep?.type === 'compare' ? 'text-yellow-400 font-bold' : ''}>while (j &gt; 0 && a[j-1] {sortOrder === 'asc' ? '>' : '<'} a[j]) &#123;</p>
        <p className={`pl-3 ${currentStep?.type === 'swap' ? 'text-orange-400 font-bold' : ''}`}>swap(a[j], a[j-1]);</p>
        <p className="pl-3">j--;</p>
        <p>&#125;</p>
      </>
    );
    if (algorithm === 'quick') return (
      <>
        <p className={currentStep?.type === 'compare' ? 'text-yellow-400 font-bold' : ''}>if (a[j] {sortOrder === 'asc' ? '<' : '>'} pivot) &#123;</p>
        <p className="pl-3">i++;</p>
        <p className={`pl-3 ${currentStep?.type === 'swap' ? 'text-orange-400 font-bold' : ''}`}>swap(a[i], a[j]);</p>
        <p>&#125;</p>
      </>
    );
    if (algorithm === 'interchange') return (
      <>
        <p className={currentStep?.type === 'compare' ? 'text-yellow-400 font-bold' : ''}>if (a[j] {sortOrder === 'asc' ? '<' : '>'} a[i]) &#123;</p>
        <p className={`pl-3 ${currentStep?.type === 'swap' ? 'text-orange-400 font-bold' : ''}`}>swap(a[i], a[j]);</p>
        <p>&#125;</p>
      </>
    );
    if (algorithm === 'merge') return (
      <>
        <p>mergeSort(left, mid);</p>
        <p>mergeSort(mid + 1, right);</p>
        <p className={currentStep?.type === 'compare' ? 'text-yellow-400 font-bold' : ''}>merge(left, mid, right);</p>
      </>
    );
    return (
      <>
        <p>buildHeap(a);</p>
        <p className={currentStep?.type === 'swap' ? 'text-orange-400 font-bold' : ''}>swap(a[0], a[i]);</p>
        <p className={currentStep?.type === 'compare' ? 'text-yellow-400 font-bold' : ''}>heapify(a, i, 0);</p>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white font-sans p-3 md:p-4 overflow-y-auto">
      <div className="max-w-6xl mx-auto flex flex-col gap-4 pb-8">
        <header className="relative flex flex-col md:flex-row items-center justify-between py-2 gap-4">
          <button onClick={onBack} className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 transition-all border border-slate-700 text-sm font-bold">
            <ArrowLeft size={16} /> Quay lại
          </button>
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-black tracking-tighter">
              {algorithm === 'bubble' ? 'Sắp xếp nổi bọt' : algorithm === 'insertion' ? 'Sắp xếp chèn' : 'Sắp xếp chọn'}
            </h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
              {algorithm === 'bubble' ? 'Bubble Sort' : algorithm === 'insertion' ? 'Insertion Sort' : 'Selection Sort'}
            </p>
          </div>
          <div className="hidden md:block w-[100px]" /> {/* Spacer for centering on desktop */}
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 items-start flex-1">
          <div className="w-full lg:col-span-8 flex flex-col gap-4">
            <section className="bg-slate-900/40 backdrop-blur-xl border-2 border-slate-800/80 rounded-[1.5rem] p-4 md:p-6 shadow-2xl relative overflow-visible min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center">
              <div className="absolute top-4 right-4 z-20">
                <div className={`flex bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-xl transition-opacity duration-300 ${isSorting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <button onClick={() => !isSorting && setSortOrder('asc')} disabled={isSorting} className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all ${sortOrder === 'asc' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Tăng</button>
                  <button onClick={() => !isSorting && setSortOrder('desc')} disabled={isSorting} className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all ${sortOrder === 'desc' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Giảm</button>
                </div>
              </div>
              <div className={`flex ${algorithm === 'bubble' ? 'flex-col overflow-y-auto py-6' : 'flex-wrap items-center py-6'} justify-center items-center gap-2 md:gap-3 w-full h-full custom-scrollbar`}>
                {array.map((item) => (
                  <motion.div 
                    key={item.id} 
                    layout 
                    initial={false} 
                    animate={{ 
                      opacity: 1, 
                      scale: item.status === 'comparing' || item.status === 'swapping' || item.status === 'active' ? 1.1 : 1, 
                      x: algorithm === 'bubble' ? (item.swapDirection === 'up' ? -30 : item.swapDirection === 'down' ? 30 : 0) : 0,
                      y: (algorithm !== 'bubble' && item.swapDirection)
                        ? (item.swapDirection === 'up' ? -60 : 60)
                        : 0,
                      zIndex: item.status === 'comparing' || item.status === 'swapping' || item.status === 'active' ? 50 : 1, 
                      backgroundColor: item.status === 'comparing' ? '#eab308' : item.status === 'swapping' ? '#6366f1' : item.status === 'active' ? '#3b82f6' : item.status === 'sorted' ? '#10b981' : 'rgba(37, 99, 235, 0.1)', 
                      borderColor: item.status === 'comparing' ? '#facc15' : item.status === 'swapping' ? '#818cf8' : item.status === 'active' ? '#60a5fa' : item.status === 'sorted' ? '#34d399' : 'rgba(59, 130, 246, 0.3)', 
                      color: '#ffffff' 
                    }} 
                    transition={{ 
                      layout: { duration: speedRef.current * 0.0008, ease: "easeInOut" }, 
                      x: { duration: speedRef.current * 0.0004, ease: "easeOut" }, 
                      y: { duration: speedRef.current * 0.0004, ease: "easeInOut" }, 
                      scale: { duration: 0.2 }, 
                      backgroundColor: { duration: 0.2 }, 
                      borderColor: { duration: 0.2 } 
                    }} 
                    className={`relative flex items-center justify-center ${algorithm === 'bubble' ? 'w-10 h-10 md:w-12 md:h-12' : 'w-9 h-9 md:w-11 md:h-11'} rounded-lg md:rounded-xl font-bold text-base md:text-lg shadow-lg border-2 flex-shrink-0`}
                  >
                    {item.value}
                    {item.status !== 'default' && (
                      <motion.div 
                        initial={{ opacity: 0, ...(algorithm === 'bubble' ? { x: 10 } : { y: 10 }) }} 
                        animate={{ opacity: 1, ...(algorithm === 'bubble' ? { x: 0 } : { y: 0 }) }} 
                        className={`absolute ${algorithm === 'bubble' ? '-right-16 md:-right-20' : '-bottom-8 md:-bottom-10'} text-[8px] md:text-[9px] uppercase tracking-[0.1em] font-black text-slate-500 whitespace-nowrap`}
                      >
                        {item.status === 'comparing' && 'So sánh'}
                        {item.status === 'swapping' && 'Hoán đổi'}
                        {item.status === 'active' && 'Đang xét'}
                        {item.status === 'sorted' && 'Đã xong'}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <StatCard icon={<Zap size={18} className="text-yellow-400" />} label="Vòng lặp" value={stats.passes} />
              <StatCard icon={<RefreshCw size={18} className="text-orange-400" />} label="Hoán đổi" value={stats.swaps} />
              <StatCard icon={<Activity size={18} className="text-blue-400" />} label="So sánh" value={stats.comparisons} />
            </div>
          </div>

          <div className="w-full lg:col-span-4 flex flex-col gap-4">
            <section className="bg-slate-900/60 backdrop-blur-2xl border-2 border-slate-700/50 rounded-[1.5rem] p-5 shadow-2xl space-y-6">
              <div className="flex items-center gap-2"><div className="p-1.5 bg-slate-800 rounded-lg"><Settings size={18} className="text-slate-300" /></div><h2 className="font-bold text-lg">Điều khiển</h2></div>
              <div className="space-y-6">
                <div className="flex flex-col gap-3 mt-2">
                  {!isSorting ? (
                    <button onClick={startSort} className="w-full bg-blue-500 hover:bg-blue-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/30 active:scale-[0.98] text-sm"><Play size={16} fill="currentColor" /> Bắt đầu</button>
                  ) : (
                    <button onClick={() => { setIsPaused(!isPaused); isPausedRef.current = !isPaused; }} className={`w-full ${isPaused ? 'bg-amber-600 shadow-amber-900/20' : 'bg-slate-700 shadow-slate-900/20'} hover:opacity-95 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] text-sm`}>{isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}{isPaused ? 'Tiếp tục' : 'Tạm dừng'}</button>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={handleRandomize} className="bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl transition-all active:scale-[0.98] border border-slate-700 flex items-center justify-center gap-1.5 font-semibold text-xs"><Zap size={14} className="text-yellow-400" /> Ngẫu nhiên</button>
                    <button onClick={handleReset} className="bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl transition-all active:scale-[0.98] border border-slate-700 flex items-center justify-center gap-1.5 font-semibold text-xs"><RotateCcw size={14} /> Đặt lại</button>
                  </div>
                </div>
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest"><span>Tốc độ mô phỏng</span><div className="flex items-center gap-1.5"><input type="text" value={(speed / 1000).toFixed(2)} onChange={(e) => { const val = parseFloat(e.target.value); if (!isNaN(val)) setSpeed(Math.round(val * 1000)); }} className="w-14 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-center text-blue-400 font-bold text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" /><span className="text-slate-500">giây</span></div></div>
                  <input type="range" min="50" max="2000" step="50" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dãy số tùy chỉnh</label>
                  <div className="flex gap-2">
                    <input type="text" value={customInput} onChange={(e) => setCustomInput(e.target.value)} placeholder="Ví dụ: 10, 5, 8..." disabled={isSorting} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-slate-200" />
                    <button onClick={() => generateArray(customInput)} disabled={isSorting} className="bg-blue-600 hover:bg-blue-500 text-white px-3 rounded-xl disabled:opacity-50 transition-all flex items-center gap-1.5 font-bold shadow-lg shadow-blue-900/20 text-xs"><RefreshCw size={14} /> Cập nhật</button>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/40 backdrop-blur-xl border-2 border-slate-800 rounded-[1.5rem] p-4 shadow-xl flex flex-col min-h-[250px]">
              <div className="flex items-center gap-2 mb-2"><div className="p-1.5 bg-blue-500/10 rounded-lg"><Info size={16} className="text-blue-400" /></div><h2 className="font-bold text-base">Giải thích</h2></div>
              <div className="flex flex-col flex-1 justify-between gap-4">
                <div className="relative min-h-[60px] max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                  <AnimatePresence mode="wait">
                    {currentStep && (
                      <motion.div key={currentStep.message} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className={`p-2.5 rounded-xl border-l-3 leading-snug shadow-inner ${currentStep.type === 'info' ? 'bg-blue-500/5 border-blue-500 text-blue-100' : ''} ${currentStep.type === 'compare' ? 'bg-yellow-500/5 border-yellow-500 text-yellow-100' : ''} ${currentStep.type === 'swap' ? 'bg-orange-500/5 border-orange-500 text-orange-100' : ''} ${currentStep.type === 'done' ? 'bg-emerald-500/5 border-emerald-500 text-emerald-100' : ''}`}>
                        <p className="text-xs font-medium">{currentStep.message}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="pt-2 border-t border-slate-800/50">
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest font-black mb-1">Mã giả thuật toán</p>
                  <div className="bg-slate-950/50 p-2.5 rounded-lg font-mono text-[10px] text-slate-400 space-y-0.5 border border-slate-800/50">
                    {getPseudoCode()}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function StatCard({ icon, label, value }: { icon: ReactNode, label: string, value: number }) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-md border-2 border-slate-800 p-3 rounded-xl flex items-center gap-3 shadow-lg">
      <div className="p-1.5 bg-slate-800 rounded-lg">{icon}</div>
      <div>
        <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500">{label}</p>
        <p className="text-lg font-bold tabular-nums">{value}</p>
      </div>
    </div>
  );
}
