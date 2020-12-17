// setup
const triggerShow = new CustomEvent('show1')
document.querySelector('#demo-trigger-1').addEventListener("click", (event) => {
  document.querySelector('#hide-demo').dispatchEvent(triggerShow)
  })
// end setup
function showContent() {
  return true
}

Blocker("#hide-demo").hide('show1')
let blockDemo = Blocker("#block-demo").block("orange", "blockerjsHold", {holdDuration: 2000})
blockDemo.setAfterEffect({mode: "tremble", time: 2000})
blockDemo.setShowMethod({mode: "scratch", color: "orange", percentReveil: 70, scratchSize: 10})
let blockDemo2 = Blocker("#block-demo2").block("orange")
blockDemo2.setAfterEffect({mode: "tremble", time: 2000})
blockDemo2.setShowMethod({mode: 'slide', color: 'orange'})
blockDemo2.setShowAction({mode: "puzzle",color:"orange", trueMap: [[true, false,false,false],
                                                                  [true, false,false,false],
                                                                  [false, true,false,false],
                                                                  [false, false,true,false]]})
Blocker("#blur-demo").blur(2, "blockerjsScroll", {scrollTop: 100})
let passwordDemo = Blocker("#password-demo").setShowAction({mode: "password", password:"123123"}).block("orange", "blockerjsMultiClick", {multiClicks: 5})
passwordDemo.setAfterEffect({mode:"recover", time: 2000})

