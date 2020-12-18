// setup
const triggerShow = new CustomEvent('show1')
document.querySelector('#demo-trigger-1').addEventListener("click", (event) => {
  document.querySelector('#hide-demo').dispatchEvent(triggerShow)
  })
// end setup
function showContent() {
  return true
}

let hideDemo = Blocker("#hide-demo").hide('show1')

let blockDemo = Blocker("#block-demo").block("lightblue")

let blockDemo2 = Blocker("#block-demo2").block("orange", "blockerjsHold", {holdDuration: 2000})
blockDemo2.setShowAction({mode: "password", password:"123123"})

let blockDemo3 = Blocker("#block-demo3").block("lightblue")

blockDemo3.setAfterEffect({mode: "tremble", time: 2000})
blockDemo3.setShowMethod({mode: 'scratch', scratchSize: 15, percentReveil: 85,  color: 'lightblue'})


let blurDemo = Blocker("#blur-demo").blur(2, "blockerjsScroll", {scrollTop: 900})

let allDemo = Blocker("#all-demo").block("orange", "blockerjsMultiClick", {multiClicks: 5})

allDemo.setShowAction({mode: "puzzle",color:"lightblue", trueMap: [[true, false,false,false],
[true, false,false,false],
[false, true,false,false],
[false, false,true,false]]})

allDemo.setShowMethod({mode: 'slide', color: 'orange'})

allDemo.setAfterEffect({mode:"recover", time: 2000})