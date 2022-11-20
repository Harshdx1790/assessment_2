
c = document.querySelector("canvas[le]")
h = c.height
dataY = []
dataX = []
openTrend = []
high = []
low = []
w = c.width 
un = 0
ys = 0
dataT = []

ctx = c.getContext('2d')
const loadData = async (url) => {
    const response = await fetch(url)
    const jsonData = await response.json()
    let keys = Object.keys(jsonData[0])
    let dimensionData = []
    let measureData = []
    jsonData.forEach((item,index) => {
        // if(index<12){
            dimensionData.push(item[keys[0]])
            measureData.push(item[keys[4]])
            openTrend.push(item[keys[1]])
            high.push(item[keys[2]])
            low.push(item[keys[3]])
        // }
       
    })
    dataY = dimensionData
    dataX = measureData
    console.log(dataY)
    console.log(dataX)
    un = ((Math.max(...dataX) - Math.min(...dataX)) / 5)
    ys = (w - 60) / dataY.length
    chartLine()
    digram()
    data()
    draw(dataX,"#03a9f4")
    draw(openTrend,"#FFA500")
    draw(high,"#00FF00")
    draw(low,"#FF0000")
    pointes(dataX,"#03a9f4")
    pointes(openTrend,"#FFA500")
    pointes(high,"#00FF00")
    pointes(low,"#FF0000")
   

}

loadData("https://eodhistoricaldata.com/api/eod/MCD.US?from=2017-01-05&to=2017-1-21&period=d&fmt=json&api_token=demo")



const digram = () => {
    y = 60
    x = 1
    ctx.strokeStyle = "#e6e6e6"
    while (y < w) {
        ctx.beginPath()
        ctx.moveTo(y, 0)
        ctx.lineTo(y, h - 30)
        ctx.stroke()
        y += 30
    }
    while (x < h - 30) {
        ctx.beginPath()
        ctx.moveTo(60, x)
        ctx.lineTo(w, x)
        ctx.stroke()
        x += 30
    }
}
const chartLine =() => {
    ctx.strokeStyle = "#000"
    ctx.beginPath()
    ctx.moveTo(60, 0)
    ctx.lineTo(60, h - 30)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(w, h - 30)
    ctx.lineTo(60, h - 30)
    ctx.stroke()
}

const draw = (drawData,color) => {
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.beginPath()
    // ctx.lineJoin = "round";
    y = 60
    height = h - 30
    line = 30
    start = 30
    // ctx.moveTo(60, h-30);
    for (data of drawData) {
        max = Math.max(...drawData),
            test = 30;
        while (max > data) {
            max = max - 1
            test += line / un
        }
        ctx.lineTo(30 + y, test)
        x = 30
        y += ys
    }
    ctx.stroke()
    ctx.restore()
}
const pointes = (drawData,color) => {
    ctx.fillStyle = color
    y = 60
    height = h - 30
    line = 30
    start = 30
    let i =0
    for (data of drawData) {
        max = Math.max(...drawData),
            test = 30;
        while (max > data) {
            max = max - 1
            test += line / un
        }
        // if(i%2==0){
            circle(30 + y, test)
    //     }
    //    i++
        dataT.push({ data: Math.round(test) + "," + Math.round(30 + y) + "," + Math.round(data) })
        x = 30
        y += ys
    }
    ctx.stroke()
}
function data() {
    y = 60
    x = 30
    n = Math.max(...dataX)
    let i=0
    for (ydata of dataY) {

        ctx.font = "12px Arial";
        // if(i%2==0){
            ctx.fillText(ydata, y, h - 10);
    //     }
    //    i++
       
        y += ys
    }
    while (x < h - 30) {
        ctx.font = "11px Arial";
        ctx.fillText(n, 0, x + 5);
        
        n = n - un
        x += 30
    }

}

const circle = (x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill()
}


c.onmousemove = function (e) {
    for (let data of dataT) {
        for (const [key, value] of Object.entries(data)) {
            let dataG = value.split(","),
                lx = e.layerX,
                ly = e.layerY,
                dx = dataG[1],
                dy = dataG[0]
            if (range(dx - 10, Math.floor(dx) + 10).includes(lx) && range(dy - 10, Math.floor(dy) + 10).includes(ly)) {
                $('draw-canvas-data-set').innerHTML = dataG[2]
                $('draw-canvas-data-set').style.opacity = "1"
                $('draw-canvas-data-set').style.left = e.clientX + "px"
                $('draw-canvas-data-set').style.top = e.clientY + "px"
            } if (range(dx - 10, Math.floor(dx) + 10).includes(lx) && !range(dy - 10, Math.floor(dy) + 10).includes(ly)) {
                $('draw-canvas-data-set').style.opacity = "0"
            }
            lx = lx - 1
            dx = dx - 1
        }
    }
}

const range = (start, end) => {
    let range = [...Array(end + 1).keys()].filter(value => end >= value && start <= value);
    return range
}
function $(object) {
    return document.querySelector(object);
}