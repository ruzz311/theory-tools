//  https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore


/////////// FUNCTIONS 

export function throttle(func: (...x: any) => void, timeFrame: any) {
    var lastTime: number | Date = 0;
    return function (...args: any) {
        var now = new Date();
    
        console.log({
            now: +now, 
            lastTime: +lastTime, 
            timeFrame, 
            // @ts-ignore
            nowMinusLastTime: (now - lastTime),
            // @ts-ignore
            isBiggerthanTimeframe: (now - lastTime >= timeFrame)
        })
        // @ts-ignore
        if (now - lastTime >= timeFrame) {
            func(...args);
            lastTime = now;
        }
    };
  }
  

  export function debounce(func: (...x: any) => void, wait: number, immediate?: boolean, max?: number) {
    // @ts-ignore
    let timeout: Timeout;
    let totalTime = 0;
    let lastCall = Date.now();
    return function () {
        // @ts-ignore
        const context = this;
        let args = arguments;
        clearTimeout(timeout);
        totalTime += +lastCall - (+Date.now());
        console.log(`checking timeout ${{totalTime}}`);
        timeout = setTimeout(function() {
            timeout = null;
            if (!immediate) {
                // @ts-ignore
                func.apply(context, args);
            }
        }, wait);
        if (immediate && !timeout) {
            // @ts-ignore
            func.apply(context, args);
        }
    };
  }
  