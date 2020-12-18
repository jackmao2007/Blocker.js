function Blocker(selector) {
    let self = {}
    self.selector = selector
    self.element = document.querySelector(self.selector)
    self.replacement = self.element.cloneNode(true)
    self.showAction = () => self.replacement.dispatchEvent(self.showEvent)
    self.showEvent = new CustomEvent('blockerjsShowEvent')
    self.afterEvent = new CustomEvent('blockerjsAfterEvent')

    self.showMethod = () => {self.replacement.parentElement.replaceChild(self.element, self.replacement)
        self.element.dispatchEvent(self.afterEvent)}
    self.afterEffect = () => {
        return
    }

    self.hide = function(triggerEvent, triggerEventOptions={}){
        // need custom event to trigger showing
        self.replacement = document.createElement("div")
        let replacement = self.replacement
        replacement.id = self.element.id
        replacement.style = self.element.style

        this.setupTriggerEvent(triggerEvent, triggerEventOptions)
        replacement.addEventListener(triggerEvent, (event) => {
            replacement.parentElement.replaceChild(self.element, replacement)
        })
        self.element.parentElement.replaceChild(replacement, self.element)
        return self
    }

    self.block = function(color, triggerEvent="click", triggerEventOptions={}){
        const width = self.element.getBoundingClientRect().width
        const height = self.element.getBoundingClientRect().height
        self.replacement = document.createElement("div")
        let replacement = self.replacement
        replacement.id = self.element.id
        replacement.style = `;display: ${getComputedStyle(self.element).display} ;height: ${height}px; width: ${width}px; background-color: ${color};`
        this.setupTriggerEvent(triggerEvent, triggerEventOptions)
        replacement.addEventListener(triggerEvent, (event) => {
            self.showAction()
        })
        replacement.addEventListener('blockerjsShowEvent', (event) => {
            self.showMethod()
        })
        self.element.addEventListener('blockerjsAfterEvent', (event) => {
            self.afterEffect()
        })
        self.element.parentElement.replaceChild(replacement, self.element)
        return self

    }

    self.blur = function(blurStrength, triggerEvent="click", triggerEventOptions={}){
        const width = self.element.offsetWidth
        const height = self.element.offsetHeight
        let replacement = self.replacement
        replacement.style = `;display: ${getComputedStyle(self.element).display}; -webkit-filter: blur(${blurStrength}px);
                                                    -moz-filter: blur(${blurStrength}px);
                                                    -o-filter: blur(${blurStrength}px);
                                                    -ms-filter: blur(${blurStrength});filter: blur(${blurStrength}px);`
        this.setupTriggerEvent(triggerEvent, triggerEventOptions)
        replacement.addEventListener(triggerEvent, (event) => {
            self.showAction()
        })
        replacement.addEventListener('blockerjsShowEvent', (event) => {
            self.showMethod()
            
        })
        self.element.addEventListener('blockerjsAfterEvent', (event) => {
            self.afterEffect()
        })
        self.element.parentElement.replaceChild(replacement, self.element)
        return self
    }

    // setupTriggerEvent
    self.setupTriggerEvent = function(triggerEvent, triggerEventOptions) {
        if (triggerEvent === "blockerjsScroll") {
            const scrollEvent = new CustomEvent('blockerjsScroll')
            window.onscroll = function() {myFunction()};
            const scrollTop = triggerEventOptions.scrollTop
            function myFunction() {
                if (document.body.scrollTop > scrollTop || document.documentElement.scrollTop > scrollTop) {
                    if (self.replacement.parentElement){
                        self.replacement.dispatchEvent(scrollEvent)
                    }
                }
            }
        } else if (triggerEvent === "blockerjsHold") {
            let timer = 0
            const holdEvent = new CustomEvent('blockerjsHold')
            let counter = ''
            self.replacement.addEventListener("mousedown", (e) => {
                counter = setInterval(() => {
                    timer += 500
                    if (timer >= triggerEventOptions.holdDuration){
                        clearInterval(counter)
                        self.replacement.dispatchEvent(holdEvent)
                    }
                }, 500)
            })
            self.replacement.addEventListener("mouseup", (e) => {
                timer = 0
                clearInterval(counter)
            })
        } else if (triggerEvent === "blockerjsMultiClick") {
            const multiClickEvent = new CustomEvent('blockerjsMultiClick')
            let totalClicks = 0
            self.replacement.addEventListener("click", (e) => {
                totalClicks += 1
                if (totalClicks >= triggerEventOptions.multiClicks){
                    totalClicks = 0
                    self.replacement.dispatchEvent(multiClickEvent)
                }
            })
        }
    }

    self.setShowAction = function(config){
        if (config.mode === "password"){
            self.showAction = () => {
                if (!self.passwordLock){
                    let cont = document.createElement("div")
                    let btn = document.createElement("button")
                    let inpt = document.createElement("input")
                    self.passwordLock = cont
                    const repPos = self.replacement.getBoundingClientRect()
                    cont.style = `; position: absolute; left:${repPos.x + document.documentElement.scrollLeft+ repPos.width/2}px;
                                    top:${repPos.y + document.documentElement.scrollTop + repPos.height/2}px; transform: translate(-50%, -50%);
                                    max-width: ${repPos.width}; max-height: ${repPos.height}`
                    btn.innerHTML = "confirm"
                    cont.appendChild(inpt)
                    cont.appendChild(btn)
                    inpt.placeholder = "enter the password"
                    const checkVal = (event) => {
                        if (inpt.value == config.password){
                            self.replacement.dispatchEvent(self.showEvent)
                            cont.parentElement.removeChild(cont)
                            self.passwordLock = null
                        }else{
                            cont.parentElement.removeChild(cont)
                            self.passwordLock = null
                        }
                    }
                    btn.onclick = checkVal
                    self.replacement.parentElement.appendChild(cont) 
                }
            }
        } else if (config.mode === "puzzle"){
            self.showAction = () => {
                const size = config.size ? config.size : 4
                if (self.puzzleSvg){
                    return
                }

                let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("width", 100);
                svg.setAttribute("height", 100);
                svg.setAttribute("viewBox", [0, 0, 100 * size, 100 * size].join(" "));
                const repPos = self.replacement.getBoundingClientRect()
                svg.style = `; position: absolute; left:${repPos.x + document.documentElement.scrollLeft+ repPos.width/2}px;
                top:${repPos.y + document.documentElement.scrollTop + repPos.height/2}px; transform: translate(-50%, -50%);
                border: 1px solid black`

                this.replacement.parentElement.appendChild(svg)
                self.puzzleSvg = svg

                let map = []
                for (let i = 0; i < size; i++) {
                    map.push([])
                    for (let j = 0; j < size; j++){
                        map[i].push(false)
                        let g = document.createElementNS("http://www.w3.org/2000/svg", 'g')
                        let rec = document.createElementNS("http://www.w3.org/2000/svg", 'rect')
                        g.setAttribute("transform", ["translate(", j*100, ",", i*100, ")"].join(""))
                        g.appendChild(rec)
                        rec.setAttribute("width", 100)
                        rec.setAttribute("height", 100)
                        rec.setAttribute("fill", "white")
                        rec.style = "; stroke:black; stroke-width:1;"
                        svg.appendChild(g)
                        rec.addEventListener("click", () => {
                            map[i][j] = !map[i][j]
                            if (map[i][j]){
                                rec.setAttribute("fill", config.color)
                            } else {
                                rec.setAttribute("fill", "white")
                            }
                            if (JSON.stringify(map) == JSON.stringify(config.trueMap)){
                                self.replacement.dispatchEvent(self.showEvent)
                                svg.parentElement.removeChild(svg)
                                self.puzzleSvg = null
                                window.removeEventListener('click', handleOffClickPuzzleRemove)
                            }
                        })
                    }
                }
                setTimeout(() => {
                    window.addEventListener('click', handleOffClickPuzzleRemove);
                }, 100);

                function handleOffClickPuzzleRemove(e){
                    if (self.puzzleSvg.parentElement){
                        if (!self.puzzleSvg.contains(e.target)){
                            self.puzzleSvg.parentElement.removeChild(self.puzzleSvg)
                            self.puzzleSvg = null
                            window.removeEventListener('click', handleOffClickPuzzleRemove)
                        }
                    }
                }
            }
        }
        return self
    }


    // set showmethod

    self.setShowMethod = function (config) {
        if (config.mode === "scratch"){
            self.showMethod = () => {
                let isDrawing, lastPoint
                const percentReveil = config.percentReveil ? config.percentReveil : 50
                const scratchSize = config.scratchSize ? config.scratchSize : 25
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                const repPos = self.replacement.getBoundingClientRect()
                canvas.style = `; position: absolute; left:${repPos.x + document.documentElement.scrollLeft}px;
                                    top:${repPos.y + document.documentElement.scrollTop}px;}`
                canvas.height = repPos.height
                canvas.width = repPos.width
            
                ctx.beginPath()
                ctx.rect(0, 0, canvas.width, canvas.height)
                ctx.fillStyle = config.color
                ctx.fill()
                ctx.textBaseline = 'middle';
                ctx.textAlign = "center";
                ctx.font = "30px Comic Sans MS";
                ctx.fillStyle = "white";
                ctx.fillText("Scratch", canvas.width/2, canvas.height/2);
                
                canvas.addEventListener('mousedown', handleMouseDown, false)
                canvas.addEventListener('mousemove', handleMouseMove, false)
                canvas.addEventListener('mouseup', handleMouseUp, false)

                self.replacement.parentElement.appendChild(canvas) 
                self.replacement.parentElement.replaceChild(self.element, self.replacement)
                
                function getBrushPos(e, canvas) {
                    const xRef = e.clientX
                    const yRef = e.clientY
                    var canvasRect = canvas.getBoundingClientRect()
                    return {
                    x: Math.floor((xRef-canvasRect.left)/(canvasRect.right-canvasRect.left)*canvas.width),
                    y: Math.floor((yRef-canvasRect.top)/(canvasRect.bottom-canvasRect.top)*canvas.height)
                    }
                }
                
                
                function handlePercentage() {
                    const pixels   = ctx.getImageData(0, 0, canvas.width, canvas.height)
                    const pdata    = pixels.data
                    
                    let count    = 0;
                
                    for(var i = count = 0; i < pdata.length; i += 1) {
                        if (parseInt(pdata[i]) === 0) {
                            count++;
                        }
                    }
                    if (count / pdata.length * 100 > percentReveil) {
                        canvas.parentNode.removeChild(canvas)
                        self.element.dispatchEvent(self.afterEvent)
                    }
                }
                
                function handleMouseDown(e) {
                isDrawing = true;
                lastPoint = getBrushPos(e, canvas)
                }

                function handleMouseMove(e) {
                    if (isDrawing) { 
                        e.preventDefault()
                
                        var currentPoint = getBrushPos(e, canvas),
                            x, y;
                        
                        x = lastPoint.x 
                        y = lastPoint.y 
                        ctx.beginPath();
                        ctx.arc(x, y, scratchSize, 0, 2*Math.PI, true)
                        ctx.fillStyle = '#000'
                        ctx.globalCompositeOperation = "destination-out"
                        ctx.fill()
                        
                        lastPoint = currentPoint
                        handlePercentage()
                    }
                }
                    
                function handleMouseUp(e) {
                        isDrawing = false
                }
            }

        } else if (config.mode === 'fade') {
            self.showMethod = () => {
                let rep = document.createElement("div")
                const repPos = self.replacement.getBoundingClientRect()
                rep.style = `;display: ${getComputedStyle(self.element).display}; position: absolute; left:${repPos.x + document.documentElement.scrollLeft}px;
                top:${repPos.y + document.documentElement.scrollTop}px;}; height:${repPos.height}px; width:${repPos.width}px; background-color: ${config.color};`

                self.replacement.parentElement.appendChild(rep)
                self.replacement.parentElement.replaceChild(self.element, self.replacement)
    
                let op = 1;  // initial opacity
                let timer = setInterval(function () {
                    if (op <= 0.1){
                        clearInterval(timer);
                        rep.parentElement.removeChild(rep)
                        self.element.dispatchEvent(self.afterEvent)
                    }
                    rep.style.opacity = op;
                    rep.style.filter = 'alpha(opacity=' + op * 100 + ")";
                    op -= op * 0.1;
                }, 50);
            }
        } else if (config.mode === "slide") {
            self.showMethod = () => {
                let rep = document.createElement("div")
                const speed = config.speed ? config.speed : 10
                const repPos = self.replacement.getBoundingClientRect()
                rep.style = `;display: ${getComputedStyle(self.element).display}; position: absolute; left:${repPos.x + document.documentElement.scrollLeft}px;
                top:${repPos.y + document.documentElement.scrollTop}px;}; height:${repPos.height}px; width:${repPos.width}px; background-color: ${config.color};`

                self.replacement.parentElement.appendChild(rep)
                self.replacement.parentElement.replaceChild(self.element, self.replacement)


                let pos = parseInt(rep.style.left);  // initial position
                const end = pos + parseInt(rep.style.width)

                let anim = setInterval(function () {
                    if (pos >= end){
                        clearInterval(anim);
                        rep.parentElement.removeChild(rep)
                        self.element.dispatchEvent(self.afterEvent)
                    }
                    rep.style.left = pos + "px";
                    pos = pos + Math.ceil(speed * parseInt(rep.style.width)/(end - pos))
                }, 25);
            }
        }
        return self
    }

    // set afterEffect
    self.setAfterEffect = function (config){
        if (config.mode === "recover" ){
            const time = config.time
            self.afterEffect = () => {
                setTimeout(() => {self.element.parentElement.replaceChild(self.replacement, self.element)}, time)
            }
        }else if (config.mode === "tremble"){
            const time = config.time
            let mag = config.trembleMagnitude ? config.trembleMagnitude : 10
            self.afterEffect = () => {
                let runTremb = true
                setTimeout(() => {
                    runTremb = false
                }, time);

                const tremb = () => {                  
                    const randomInt = (min, max) => {
                      return Math.floor(Math.random() * (max - min + 1)) + min;
                    };
                    if (runTremb) {
                
                    const randomX = randomInt(-mag, mag)
                    const randomY = randomInt(-mag, mag)
                
                    self.element.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)'
                
                    requestAnimationFrame(tremb)
                    } else {
                    self.element.style.transform = 'translate(' + 0 + ', ' + 0 + ')'
                    }
                }

                tremb()
            }
            
        }
        return self
    }

    return self
}