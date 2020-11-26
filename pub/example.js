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
Blocker("#block-demo").block("orange")
Blocker("#blur-demo").blur(2)
Blocker("#password-demo").setShowAction({mode: "password", password:"123123"}).block("orange")