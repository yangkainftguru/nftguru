(async ()=>{
    await autoScroll();
})();

async function autoScroll(page){
        await new Promise(async (resolve, _) => {
            let i = 0;
            while(i<4){
                await delay(2000);
                i++;
                console.log(i);
            }
            // let totalHeight = 0;
            // const distance = 100;
            // let scrollHeight;
            // while (totalHeight < scrollHeight) {
            //     const scrollHeight = document.body.scrollHeight;
            //     window.scrollBy(0, distance);
            //     totalHeight += distance;
            
            //     await delay(100)
            // }
            // resolve();
        });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}