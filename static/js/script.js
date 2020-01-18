var game = document.querySelector(".game");
var button = document.querySelector("#play");
var button_hide = document.querySelector("#hide");
var container = document.querySelector(".all_container");
var counter = document.querySelector(".points");
var hp_container = document.querySelector(".hp");
var hp_number = document.querySelector(".hp_number");
var start_hp_holder = document.querySelector("#hp");
var select = document.querySelectorAll("select");
var start_hp = start_hp_holder.options[start_hp_holder.selectedIndex].value;
var ul = document.querySelector("ul");
var line = document.querySelector(".linia");
var line2d = line.getContext("2d");
var scoreboard_dic = [];
var circle_number = 1;
var hp = 0;
var first_circle_pos_x = 0;
var first_circle_pos_y = 0;
var next_circle_pos_x = 0;
var next_circle_pos_x = 0;
var last_hp_width = 0;
var button_hide_change = true;
var mql = window.matchMedia('(max-width:1000px)');

hp = start_hp;
hp_number.innerHTML = "HP: " + hp;

function onWebsiteLoad()
{
    if(mql.matches)
    {
        button_hide.style = "hidden";
    } 
    else
    {
        button_hide.style = "visible";
    }
    mql.addListener(MediaCheck = () => {
        if(mql.matches)
        {
            button_hide.style = "hidden";
        } 
        else
        {
            button_hide.style = "visible";
        }
    });
}

onWebsiteLoad();
scoreboard();


function fixDpi() 
{
    dpi = window.devicePixelRatio;
    let style = {
        height() {
            return +getComputedStyle(line).getPropertyValue('height').slice(0, -2);
        },
        width() {
            return +getComputedStyle(line).getPropertyValue('width').slice(0, -2);
        }
    }
    line.setAttribute('width', style.width() * dpi);
    line.setAttribute('height', style.height() * dpi);
    line.width = line.height * (line.clientWidth / line.clientHeight);
    line.retinaResolutionEnabled = false;
}

function getRandomInt(min, max) 
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hide()
{
    hide_elems = document.querySelectorAll(".hide");
    expand_elems = document.querySelectorAll(".expand");

    if(button_hide_change)
    {
        button_hide_change = false;
        button_hide.innerHTML = "SHOW";
        hide_elems.forEach(element => {
            element.classList.add("hidejs");
        });
        expand_elems.forEach(element => {
           element.classList.add("expandjs");
        });
    }
    else
    {
        button_hide_change = true;
        button_hide.innerHTML = "HIDE";
        hide_elems.forEach(element => {
            element.classList.remove("hidejs");
        });
        expand_elems.forEach(element => {
            element.classList.remove("expandjs");
        });
    }

}

function settings(a)
{
    if(a == "ar")
    {
        ar = document.querySelector("#ar");
        return ar.options[ar.selectedIndex].value;
    }
    else if(a == "cs")
    {
        cs = document.querySelector("#cs");
        return cs.options[cs.selectedIndex].value;
    }
}

function countPoints()
{
    counter.innerHTML = "POINTS COUNTER: " + (circle_number - 1);
}

function updateScoreboard()
{
    nick = document.getElementById("nick").value;
    //console.log(scoreboard_dic.length);
    for(i = 0; i < scoreboard_dic.length; i++)
    {
        if(nick == scoreboard_dic[i][0])
        {
            if((circle_number-2) > scoreboard_dic[i][1])
            {
                scoreboard_dic[i][1] = (circle_number-2);
                localStorage.setItem("scoreboard", JSON.stringify(scoreboard_dic));
                //console.log("zastap nick");
                return;
            }
            else
            {
                //console.log("nie zastepuj");
                localStorage.setItem("scoreboard", JSON.stringify(scoreboard_dic));
                return;
            }
        }
    }
    if((circle_number-2) >= 0)
    {
        scoreboard_dic.push([nick, (circle_number-2)]);
        localStorage.setItem("scoreboard", JSON.stringify(scoreboard_dic));
        //console.log("nie bylo");
    }
    if(localStorage.getItem("scoreboard") != null)
    {
        scoreboard_dic = JSON.parse(localStorage.getItem("scoreboard"));
    }
}

function listScoreboard()
{
    all_li = document.querySelectorAll("li");
    all_li.forEach(element => {
        element.remove();
    });
    scoreboard_dic.forEach(element => {
        next_li = document.createElement("li");
        next_li.innerHTML = element[0] + ": " + element[1];
        ul.appendChild(next_li);
    });

}

function scoreboard()
{
    updateScoreboard();
    scoreboard_dic.sort(function(first, second) {
        return second[1] - first[1];
    });
    //console.log(scoreboard_dic);
    listScoreboard();
}

function Lost(obj)
{
    obj.addEventListener('transitionend', fade = () => {
        obj.style.opacity = "0";
        obj.addEventListener('transitionend', lose = () => {
            if(hp > 1)
            {
                hp -= 1;
                hp_container.style.width = 100 - (100/start_hp_holder.options[start_hp_holder.selectedIndex].value) - last_hp_width + "%";
                //console.log(100 - (100/start_hp_holder.options[start_hp_holder.selectedIndex].value) - last_hp_width);
                last_hp_width = (100/start_hp_holder.options[start_hp_holder.selectedIndex].value) + last_hp_width;
                //console.log(last_hp_width);
                circle_number--;
                loop();
            }
            else
            {
                console.log("You lost");
                obj.remove();
                scoreboard();
                onWebsiteLoad();
                document.getElementById("ar").disabled = false;
                document.getElementById("cs").disabled = false;
                document.getElementById("hp").disabled = false;
                document.getElementById("nick").disabled = false;
                hp_container.style.width = "0%";
                game.style.cursor= "default";
                button.innerHTML = "PLAY AGAIN";
                button.style.visibility = "visible";
                hp = 0;
            }
            hp_number.innerHTML = "HP: " + hp;
        });
    });
}

function createCircle(obj)
{
    ar = settings("ar");
    cs = settings("cs");
    obj.classList.add("circle");
    obj.innerHTML = circle_number;
    obj.style.transition = "opacity "+ ar +"s ease-in-out";
    obj.style.backgroundSize = cs + "px " + cs + "px";
    obj.style.width = cs + "px";
    obj.style.height = cs + "px";
    obj.style.lineHeight = cs + "px";
    obj.style.fontSize = (cs/50) * 25 + "px";
    game.appendChild(obj);
    cordsCircle(obj);
    circle_number++;
}

function getRandomPosition(obj)
{
    cs = settings("cs");
    x = (cs/50)*7;
    y = 100 - ((cs/50)*7);
    //console.log(x + " " + y)
    margin_top = getRandomInt(x, y);
    margin_left = getRandomInt(x, y);
    obj.style.top = margin_top + "%";
    obj.style.left = margin_left + "%";
}

function gameReset()
{
    button_hide.style.visibility = "hidden";
    button.style.visibility = "hidden";
    mql.removeListener(MediaCheck);
    document.getElementById("ar").disabled = true;
    document.getElementById("cs").disabled = true;
    document.getElementById("hp").disabled = true;
    document.getElementById("nick").disabled = true;
    hp = start_hp_holder.options[start_hp_holder.selectedIndex].value;
    hp_container.style.width = "100%";
    last_hp_width = 0;
    circle_number = 1;
    first_circle_pos_x = 0;
    first_circle_pos_y = 0;
    next_circle_pos_x = 0;
    next_circle_pos_x = 0;
    hp_number.innerHTML = "HP: " + hp;
    counter.innerHTML = "POINTS COUNTER: 0";
}

function removeCircle()
{
    circle = document.querySelector(".circle");
    circle.remove();
}

function cordsCircle(obj)
{
    fixDpi();
    resp = settings("cs");
    next_circle_pos_x = obj.offsetLeft + resp/2;
    next_circle_pos_y = obj.offsetTop + resp/2;
    //console.log("second: " + next_circle_pos_x + " " + next_circle_pos_y);
    if (first_circle_pos_x > 0 && first_circle_pos_y > 0) 
    {
        line.style.opacity = "0";
        line2d.beginPath();
        line2d.moveTo(first_circle_pos_x,first_circle_pos_y);
        line2d.lineTo(next_circle_pos_x,next_circle_pos_y);
        line2d.strokeStyle = "#FFFFFF";
        line2d.stroke();
        line2d.closePath();
        line.addEventListener('transitionend', faded = () => {
            window.getComputedStyle(line).opacity;
            line.style.opacity = "1";
            line2d.clearRect(0, 0, line.width, line.height);
        });
    }
    //console.log("first: " + first_circle_pos_x + " " + first_circle_pos_y);
    first_circle_pos_x = obj.offsetLeft + resp/2;
    first_circle_pos_y = obj.offsetTop + resp/2;
}

function hoverCircle(obj)
{
    console.log(obj);
    obj.addEventListener('keypress', function (e) {
        if (e.key === 'z') 
        {
            loop();
        }
    });
}

function first()
{
    gameReset();
    game.style.cursor= "url(static/imgs/cursor.png) 25 25, auto"
    first_circle = document.createElement("div");
    createCircle(first_circle);
    window.getComputedStyle(first_circle).opacity;
    first_circle.style.opacity = "1";
    first_circle.addEventListener("click", loop);
    //first_circle.addEventListener("mouseover", hoverCircle);
    Lost(first_circle);
}

function nextCircle()
{
    next_circle = document.createElement("div");
    getRandomPosition(next_circle);
    createCircle(next_circle);
    window.getComputedStyle(next_circle).opacity;
    next_circle.style.opacity = "1";
    next_circle.addEventListener("click", loop);
    //next_circle.addEventListener("mouseover", hoverCircle);
    Lost(next_circle);
}

function loop()
{
    countPoints();
    removeCircle();
    nextCircle();
}