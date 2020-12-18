// Click on the O in the title reveals the O
let blockerBlurDemo = Blocker("#main-title-O").blur(5)

// Click the orange block three times and enter the password 123123
let blockerblockDemo = Blocker("#main-title-E")
blockerblockDemo.block("orange", "blockerjsMultiClick", {multiClicks: 3})
blockerblockDemo.setShowAction({mode: "password", password:"123123"})
blockerblockDemo.setAfterEffect({mode:"recover", time: 5000})
blockerblockDemo.setShowMethod({mode: 'slide', color: 'orange'})