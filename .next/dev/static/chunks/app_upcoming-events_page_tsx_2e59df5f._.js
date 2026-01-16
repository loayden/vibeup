(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/upcoming-events/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UpcomingEventsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
function GoldFrameVideo({ src, className, videosMuted, videoRefs }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative border-[1px] border-amber-400 ${className || ""}`,
        style: {
            minWidth: 0,
            minHeight: 0
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
            ref: (el)=>{
                if (el && !videoRefs.current.includes(el)) {
                    videoRefs.current.push(el);
                }
            },
            src: src,
            autoPlay: true,
            loop: true,
            muted: videosMuted,
            playsInline: true,
            className: "w-full h-full object-cover"
        }, void 0, false, {
            fileName: "[project]/app/upcoming-events/page.tsx",
            lineNumber: 18,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/upcoming-events/page.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = GoldFrameVideo;
function TextSection() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-5xl mx-auto text-center py-10 px-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "uppercase text-center text-6xl font-bold tracking-wider drop-shadow-[0_0_10px_rgba(255,191,0,0.7)] mb-12 text-amber-400",
                children: "Memories"
            }, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-6 text-amber-300 leading-relaxed"
            }, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/upcoming-events/page.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_c1 = TextSection;
function SingleImageCarousel({ images, heading, text }) {
    _s();
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const prevImage = ()=>{
        setCurrentIndex((prev)=>prev === 0 ? images.length - 1 : prev - 1);
    };
    const nextImage = ()=>{
        setCurrentIndex((prev)=>prev === images.length - 1 ? 0 : prev + 1);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "max-w-6xl mx-auto py-12 px-4 flex flex-col md:flex-row items-center gap-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full md:w-1/2 aspect-square border-[1px] border-amber-400 overflow-hidden flex items-center justify-center",
                style: {
                    minWidth: 0,
                    minHeight: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: `/${images[currentIndex]}`,
                        alt: images[currentIndex],
                        className: "w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    }, void 0, false, {
                        fileName: "[project]/app/upcoming-events/page.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: prevImage,
                        "aria-label": "Previous image",
                        className: "absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-amber-400 opacity-80 hover:opacity-100 hover:scale-110 transition select-none z-10 bg-black bg-opacity-30 rounded-full p-1",
                        children: "←"
                    }, void 0, false, {
                        fileName: "[project]/app/upcoming-events/page.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: nextImage,
                        "aria-label": "Next image",
                        className: "absolute right-4 top-1/2 -translate-y-1/2 text-4xl text-amber-400 opacity-80 hover:opacity-100 hover:scale-110 transition select-none z-10 bg-black bg-opacity-30 rounded-full p-1",
                        children: "→"
                    }, void 0, false, {
                        fileName: "[project]/app/upcoming-events/page.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full md:w-1/2 text-amber-400 text-lg md:text-xl font-semibold leading-relaxed whitespace-pre-line",
                children: text || heading
            }, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/upcoming-events/page.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_s(SingleImageCarousel, "tusBbsahUVevXfyh6oH5R6YDC9Q=");
_c2 = SingleImageCarousel;
function PhotoScroller({ images, heading }) {
    _s1();
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PhotoScroller.useEffect": ()=>{
            if (scrollRef.current) {
                scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
            }
        }
    }["PhotoScroller.useEffect"], [
        images
    ]);
    const scrollNext = (ref)=>{
        if (ref.current) {
            ref.current.scrollBy({
                left: -300,
                behavior: "smooth"
            });
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "relative py-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "absolute inset-0 flex items-center justify-center uppercase text-4xl font-bold tracking-wider drop-shadow-[0_0_10px_rgba(255,191,0,0.15)] text-amber-400/15 text-center px-4 select-none pointer-events-none",
                children: heading
            }, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: scrollRef,
                className: "relative z-10 flex gap-6 overflow-x-auto px-8 scrollbar-hide",
                style: {
                    scrollSnapType: "x mandatory"
                },
                children: images.map((img)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-[280px] hover:scale-105 transition-transform duration-500 aspect-square border-[1px] border-amber-400 overflow-hidden cursor-pointer flex-shrink-0 scroll-snap-align-start",
                        style: {
                            minWidth: 0,
                            minHeight: 0
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: `/${img}`,
                            alt: img,
                            className: "w-full h-full object-cover"
                        }, void 0, false, {
                            fileName: "[project]/app/upcoming-events/page.tsx",
                            lineNumber: 133,
                            columnNumber: 13
                        }, this)
                    }, img, false, {
                        fileName: "[project]/app/upcoming-events/page.tsx",
                        lineNumber: 128,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>scrollNext(scrollRef),
                "aria-label": "Scroll photos next",
                className: "absolute right-4 top-1/2 -translate-y-1/2 text-5xl text-amber-400 opacity-80 hover:opacity-100 hover:scale-110 transition select-none",
                children: "➜"
            }, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/upcoming-events/page.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
}
_s1(PhotoScroller, "P14GFulhWAl/Oec4Pk4QeBwKyr0=");
_c3 = PhotoScroller;
function SquareVideoSection({ src, title, description, videosMuted, videoRefs }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "max-w-4xl mx-auto py-16 px-4 relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "absolute inset-0 flex items-center justify-center uppercase text-3xl font-bold tracking-wider drop-shadow-[0_0_10px_rgba(255,191,0,0.15)] text-amber-400 select-none pointer-events-none",
                children: title
            }, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 aspect-square border-[1px] border-amber-400 overflow-hidden",
                style: {
                    minWidth: 0,
                    minHeight: 0
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                    ref: (el)=>{
                        if (el && !videoRefs.current.includes(el)) {
                            videoRefs.current.push(el);
                        }
                    },
                    src: src,
                    autoPlay: true,
                    loop: true,
                    muted: videosMuted,
                    playsInline: true,
                    className: "w-full h-full object-cover"
                }, void 0, false, {
                    fileName: "[project]/app/upcoming-events/page.tsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-center mt-6 text-amber-300 leading-relaxed max-w-3xl mx-auto whitespace-pre-line",
                children: description
            }, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 185,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/upcoming-events/page.tsx",
        lineNumber: 163,
        columnNumber: 5
    }, this);
}
_c4 = SquareVideoSection;
function Separator() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
        className: "my-8 border-0 h-[1px] bg-gradient-to-r from-amber-400/40 via-yellow-300/40 to-amber-400/40"
    }, void 0, false, {
        fileName: "[project]/app/upcoming-events/page.tsx",
        lineNumber: 195,
        columnNumber: 5
    }, this);
}
_c5 = Separator;
function UpcomingEventsPage() {
    _s2();
    const [videosMuted, setVideosMuted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const videoRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UpcomingEventsPage.useEffect": ()=>{
            videoRefs.current.forEach({
                "UpcomingEventsPage.useEffect": (video)=>{
                    if (!video) return;
                    video.volume = 0.15;
                    if (videosMuted) {
                        video.muted = true;
                    } else {
                        video.muted = false;
                        video.play().catch({
                            "UpcomingEventsPage.useEffect": ()=>{}
                        }["UpcomingEventsPage.useEffect"]);
                    }
                }
            }["UpcomingEventsPage.useEffect"]);
        }
    }["UpcomingEventsPage.useEffect"], [
        videosMuted
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UpcomingEventsPage.useEffect": ()=>{
            const observer = new IntersectionObserver({
                "UpcomingEventsPage.useEffect": (entries)=>{
                    entries.forEach({
                        "UpcomingEventsPage.useEffect": (entry)=>{
                            const video = entry.target;
                            if (!video) return;
                            if (entry.isIntersecting) {
                                video.play().catch({
                                    "UpcomingEventsPage.useEffect": ()=>{}
                                }["UpcomingEventsPage.useEffect"]);
                            } else {
                                video.pause();
                            }
                        }
                    }["UpcomingEventsPage.useEffect"]);
                }
            }["UpcomingEventsPage.useEffect"], {
                threshold: 0.6
            });
            videoRefs.current.forEach({
                "UpcomingEventsPage.useEffect": (video)=>{
                    if (video) observer.observe(video);
                }
            }["UpcomingEventsPage.useEffect"]);
            return ({
                "UpcomingEventsPage.useEffect": ()=>{
                    observer.disconnect();
                }
            })["UpcomingEventsPage.useEffect"];
        }
    }["UpcomingEventsPage.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-black py-16 text-amber-400 font-semibold",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "w-full py-16 px-4 relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-10 mx-auto aspect-square border-[1px] border-amber-400 overflow-hidden",
                        style: {
                            width: "80vw",
                            maxWidth: "100%",
                            minWidth: "240px",
                            minHeight: 0
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            ref: (el)=>{
                                if (el && !videoRefs.current.includes(el)) {
                                    videoRefs.current.push(el);
                                }
                            },
                            src: "/VIBEUP.mp4",
                            autoPlay: true,
                            loop: true,
                            muted: videosMuted,
                            playsInline: true,
                            className: "w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        }, void 0, false, {
                            fileName: "[project]/app/upcoming-events/page.tsx",
                            lineNumber: 251,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/upcoming-events/page.tsx",
                        lineNumber: 249,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "uppercase text-center mt-6 text-4xl font-bold tracking-wider drop-shadow-[0_0_10px_rgba(255,191,0,0.7)]",
                        children: "Stay alive in our memories"
                    }, void 0, false, {
                        fileName: "[project]/app/upcoming-events/page.tsx",
                        lineNumber: 265,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center mt-4 text-amber-300 max-w-xl mx-auto leading-relaxed",
                        children: "Let the moments we shared continue to live on in our hearts and memories, keeping the magic of this night alive forever."
                    }, void 0, false, {
                        fileName: "[project]/app/upcoming-events/page.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Separator, {}, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 273,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextSection, {}, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 276,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "max-w-6xl mx-auto py-16 px-4 flex flex-col md:flex-row items-center gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full md:w-1/2 aspect-square border-[1px] border-amber-400 overflow-hidden",
                        style: {
                            minWidth: 0,
                            minHeight: 0
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            ref: (el)=>{
                                if (el && !videoRefs.current.includes(el)) {
                                    videoRefs.current.push(el);
                                }
                            },
                            src: "/VIBEUP2.mp4",
                            autoPlay: true,
                            loop: true,
                            muted: videosMuted,
                            playsInline: true,
                            className: "w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        }, void 0, false, {
                            fileName: "[project]/app/upcoming-events/page.tsx",
                            lineNumber: 281,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/upcoming-events/page.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full md:w-1/2 text-amber-400 text-lg md:text-xl font-semibold leading-relaxed whitespace-pre-line",
                        children: `A big thank you to the National Arab Orchestra beautifully led by Maestro Michael Ibrahim, for an unforgettable Voices of Legend Um Kalthoum concert. And a heartfelt thanks to the superstar Eman Abdel Ghani for adding that special magic to the evening. We’re truly grateful for your amazing performances! A night to remember`
                    }, void 0, false, {
                        fileName: "[project]/app/upcoming-events/page.tsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 279,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Separator, {}, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 300,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SingleImageCarousel, {
                images: [
                    "VIBEUP6.jpg",
                    "VIBEUP7.jpg",
                    "VIBEUP8.jpg",
                    "VIBEUP9.jpg",
                    "VIBEUP10.jpg",
                    "VIBEUP11.jpg",
                    "VIBEUP12.jpg",
                    "VIBEUP13.jpg",
                    "VIBEUP14.jpg",
                    "VIBEUP15.jpg",
                    "VIBEUP16.jpg",
                    "VIBEUP17.jpg",
                    "VIBEUP18.jpg"
                ],
                heading: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: "A big thank you to the National Arab Orchestra beautifully led by Maestro Michael Ibrahim, and the superstar Eman Abdel Ghani. A night to remember, filled with music, magic, and timeless legends"
                }, void 0, false)
            }, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 303,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Separator, {}, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 328,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SquareVideoSection, {
                src: "/VIBEUP1.mp4",
                title: "",
                description: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: "Right after the unforgettable night of Voices of Legends, we interviewed Maestro Michael Ibrahim and soprano Eman Abdel Ghani to share their thoughts, emotions, and the magic of bringing timeless Arabic classics back to life on stage. ✨"
                }, void 0, false),
                videosMuted: videosMuted,
                videoRefs: videoRefs
            }, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 331,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Separator, {}, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 346,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SingleImageCarousel, {
                images: [
                    "VIBEUP.jpg",
                    "VIBEUP2.jpg",
                    "VIBEUP3.jpg",
                    "VIBEUP4.jpg",
                    "VIBEUP5.jpg"
                ],
                heading: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {}, void 0, false),
                text: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: "Excited to bring the Bedouin White Party to Huntington Beach 🏝️ for the first time in California and United states 🇺🇸 🌟 Let the magic begin! #BedouinWhiteParty"
                }, void 0, false)
            }, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 349,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Separator, {}, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 369,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "max-w-6xl mx-auto py-16 px-4 flex flex-col md:flex-row items-center gap-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full md:w-1/2 aspect-square border-[1px] border-amber-400 overflow-hidden",
                        style: {
                            minWidth: 0,
                            minHeight: 0
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            ref: (el)=>{
                                if (el && !videoRefs.current.includes(el)) {
                                    videoRefs.current.push(el);
                                }
                            },
                            src: "/VIBEUP4.mp4",
                            autoPlay: true,
                            loop: true,
                            muted: videosMuted,
                            playsInline: true,
                            className: "w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        }, void 0, false, {
                            fileName: "[project]/app/upcoming-events/page.tsx",
                            lineNumber: 374,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/upcoming-events/page.tsx",
                        lineNumber: 373,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full md:w-1/2 text-amber-400 text-lg md:text-xl font-semibold leading-relaxed whitespace-pre-line",
                        children: "The National Arab Orchestra beautifully led by Maestro Michael Ibrahim, for an unforgettable Voices of Legend Um Kalthoum concert. And a heartfelt thanks to the superstar Eman Abdel Ghani for adding that special magic to the evening. We’re truly grateful for your amazing performances!” A night to remember, filled with music, magic, and timeless legends 🎶"
                    }, void 0, false, {
                        fileName: "[project]/app/upcoming-events/page.tsx",
                        lineNumber: 388,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 372,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Separator, {}, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 393,
                columnNumber: 10
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SquareVideoSection, {
                src: "/VIBEUP9.mp4",
                title: "",
                description: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: "heartfelt thank you to the incredible @abdelkrimhamdan for lighting up the stage and giving us a performance filled with soul, passion, and unforgettable moments. ✨🎶"
                }, void 0, false),
                videosMuted: videosMuted,
                videoRefs: videoRefs
            }, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 395,
                columnNumber: 1
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Separator, {}, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 406,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SingleImageCarousel, {
                images: [
                    "VIBEUP21.jpeg",
                    "VIBEUP22.jpeg",
                    "VIBEUP23.jpeg",
                    "VIBEUP24.jpeg",
                    "VIBEUP25.jpeg",
                    "VIBEUP26.jpeg",
                    "VIBEUP27.jpeg"
                ],
                heading: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: "An unforgettable night ✨🥂 From the first moment to the final countdown, this New Year’s Gala was pure magic. A special thank you to our incredible stars, Abdelkarim Hamdan and Sherine Zaza, and to our amazing audience who made this night truly legendary. 🎆"
                }, void 0, false)
            }, void 0, false, {
                fileName: "[project]/app/upcoming-events/page.tsx",
                lineNumber: 408,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/upcoming-events/page.tsx",
        lineNumber: 245,
        columnNumber: 5
    }, this);
}
_s2(UpcomingEventsPage, "wycrUCV9rv5JNh8e7zc2UCnM7Ec=");
_c6 = UpcomingEventsPage;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "GoldFrameVideo");
__turbopack_context__.k.register(_c1, "TextSection");
__turbopack_context__.k.register(_c2, "SingleImageCarousel");
__turbopack_context__.k.register(_c3, "PhotoScroller");
__turbopack_context__.k.register(_c4, "SquareVideoSection");
__turbopack_context__.k.register(_c5, "Separator");
__turbopack_context__.k.register(_c6, "UpcomingEventsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_upcoming-events_page_tsx_2e59df5f._.js.map