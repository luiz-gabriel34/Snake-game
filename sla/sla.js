const can = document.querySelector('canvas');
const ctx = can.getContext('2d');
const potu = document.querySelector('.p');
const final = document.querySelector('.fi');
const menu = document.querySelector(".menu");
const btn = document.querySelector('.jg');
const audio = new Audio('audio.mp3')
const tam = 30;
let dire, loop;
let cont = 0;
window.alert(`Bem vindo ao jogo da cobrinha para mover ela use as setas e evite os obstáculos e comida venenosas aproveite a experiência`);
const obstaculos = [
    {x: 30, y: 390},
    {x: 60, y: 390},
    {x: 90, y: 390},

    {x: 30, y: 30},
    {x: 30, y: 60},
    {x: 30, y: 90},

    {x: 390, y: 60},
    {x: 420, y: 60},
    {x: 450, y: 60},

    {x: 120, y: 120},
    {x: 150, y: 120},
    {x: 180, y: 120},

    {x: 300, y: 300},
    {x: 300, y: 330},
    {x: 300, y: 360},

    {x: 450, y: 390},
    {x: 480, y: 390},
    {x: 510, y: 390},

    {x: 360, y: 420},
    {x: 360, y: 450},
    {x: 360, y: 480},

];


const Obstaculos = () => {
    ctx.fillStyle = "#8B0000";
    obstaculos.forEach(ob => {
        ctx.fillRect(ob.x, ob.y, tam, tam);
    });
}

let cobra = [
    {x: 270, y: 240}
];

const incre = () => {
    potu.innerHTML = +potu.innerHTML + 10;
}

const ale = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

const posi = () => {
    const num = ale(0, can.width - tam);
    return Math.round(num / 30) * 30;
}

const cor = () => {
    let v = ale(0, 255);
    let ver = ale(0, 255);
    let az = ale(0, 255);

    return `rgb(${v}, ${ver}, ${az})`;
}

function c() { 
    return [
    {x: posi(), y: posi(), color: cor()},
    {x: posi(), y: posi(), color: cor()},
    ]
}

let co = c();

const com = () => {
    co.forEach(c => {
        if(!c) return;
            ctx.fillStyle = c.color;
            ctx.fillRect(c.x, c.y, tam, tam);
    })
}

const draw = () => {
    ctx.fillStyle = "pink";

    cobra.forEach((elemento, i) => {
        if(i === cobra.length - 1){
            ctx.fillStyle = "pink"
        }

        ctx.fillRect(elemento.x, elemento.y, tam, tam);
    });
};

const move = () => {
    if(!dire){
        return;
    }

    const cabe = cobra[cobra.length - 1];
    cobra.shift();

    if (dire == "right"){
        cobra.push({x: cabe.x + tam, y: cabe.y});
    }

    if (dire == "left"){
        cobra.push({x: cabe.x - tam, y: cabe.y});
    }

    if (dire == "down"){
        cobra.push({x: cabe.x, y: cabe.y + tam});
    }
    
    if (dire == "up"){
        cobra.push({x: cabe.x, y: cabe.y - tam});
    }
}

const linha = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle =  "#191919";

    for (let t = 0; t < can.width; t += 30){
        ctx.beginPath();
        ctx.lineTo(t, 0);
        ctx.lineTo(t, 600);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, t);
        ctx.lineTo(600, t);
        ctx.stroke();
    }
}

const comer = () => {
    const cabe = cobra[cobra.length - 1];

    co.forEach((k, i) => {
        if(k && cabe.x === k.x && cabe.y === k.y){
            incre();
            cobra.push({...cabe});
            audio.play();

            co[i] = null;

            if (co.every(item => item === null)){
                co = c();
            }
        }
    })
}

const checar = () => {
    const ca = cobra[cobra.length - 1];
    const canlim =  can.width - tam;

    const ce = cobra.length - 2;

    const colisao = ca.x < 0 || ca.x > canlim || ca.y < 0 || ca.y > canlim;

    const elamsm = cobra.find((posicao, index) => {
        return index < ce && posicao.x == ca.x && posicao.y == ca.y;
    });

    const obs = obstaculos.some(ob => ob.x === ca.x && ob.y === ca.y);

    if (colisao || elamsm || obs) {
        gameover();
    }


}

const gameover = () => {
    dire = undefined;
    
    document.getElementById("fi").innerHTML = potu.innerHTML;
    menu.style.display = "flex";
    can.style.filter = "blur(3px)";


}

function veneno(){
    return[
    {x: posi(), y: posi(), color: "red"},
    {x: posi(), y: posi(), color: "red"},
    {x: posi(), y: posi(), color: "red"},]
}

let vencom = 0;
let v = veneno();


const ven = () => {
    v.forEach(v => {
            ctx.fillStyle = v.color;
            ctx.fillRect(v.x, v.y, tam, tam);
    })
}

const comerVeneno = () => {
    const cabe = cobra[cobra.length - 1];

    v.forEach((ven, i) => {
        if (ven && cabe.x === ven.x && cabe.y === ven.y) {
            if (cobra.length > 1) {
                gameover();
                v = veneno();
            }

        }
    });
};


const jogo = () => {
    clearInterval(loop)
    ctx.clearRect(0,0 , 600, 600);

    draw();
    move();
    com();
    ven();
    Obstaculos()
    comerVeneno(); 
    linha();
    comer();
    checar();

    loop = setTimeout(() => {
        jogo()
    }, 300);
}

jogo();

document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowRight" && dire != "left"){
        dire = "right";
    }

    if (event.key === "ArrowLeft" && dire != "right"){
        dire = "left";
    }

    if (event.key === "ArrowDown" && dire != "up"){
        dire = "down";
    }

    if (event.key === "ArrowUp" && dire != "down"){
        dire = "up";
    }

})

btn.addEventListener('click', () => {
    potu.innerHTML = "00";
    menu.style.display = "none";
    can.style.filter = "none";

    cobra = [{x: 270, y: 240}]
})
