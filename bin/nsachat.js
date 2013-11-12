#!/usr/bin/env node

//https://github.com/hij1nx/cdir/blob/master/cdir.js#L26
//http://tldp.org/HOWTO/Bash-Prompt-HOWTO/x361.html
//http://ascii-table.com/ansi-escape-sequences-vt-100.php
//
//Position the Cursor: \033[<L>;<C>H or \033[<L>;<C>f (puts the cursor at line L and column C)


var util = require('util');

var buf = [];
var postbuf = [];
var isTyping = true;
var position = "";

process.stdin.on('data', function (text) {
//    console.log(util.inspect(text));
    if (savePosition(text)) return;
    else if (text === '\u001bOP') f1()
    else if (text === '\u001bOQ') f2()
    else if (text === '\u001bOR') f3()
    else if (text === '\u001bOS') f4()
    else if (text === '\u0001') requestPosition() //Ctrl+A
    else if (text === '\u0003') exit() //Ctrl+C
    else if (text === '\u0004') exit(); //Ctrl+D
    else if (text === '\u001b[A') up()
    else if (text === '\u001b[B') down()
    else if (text === '\u001b[C') right()
    else if (text === '\u001b[D') left()
    else {
        restoreCursor();
        if (text.match(/\r\n|\r|\n/)) {
            process.stdout.write("\r\n");
            buf = [];
        } else {
            process.stdout.write(text);
            saveCursor();
            process.stdout.write("\033[K"); //clear to end of line
            process.stdout.write(position);
            restoreCursor();
            buf.push(text);
        }
    }
});

function savePosition(text) {
    var match = text.match(/\u001b\[(\d*);(\d*)R/);
    if(match) position = " " + match[1] + "," + match[2];
    return match;
}

function requestPosition() {
    process.stdout.write("\033[6n"); //get cursor position
}

function exit() {
    process.exit();
}

function f1() {
}

function f2() {
}

function f3() {
}

function f4() {
}

function up() {
    saveCursor();
    process.stdout.write("\033[1A"); //up
}

function down() {
    saveCursor();
    process.stdout.write("\033[1B"); //down
}

function right() {
    saveCursor();
    process.stdout.write("\033[1C"); //right
}

function left() {
    saveCursor();
    process.stdout.write("\033[1D"); //left
}

function saveCursor() {
    if(!isTyping) return;
    process.stdout.write("\033[s"); //save cursor
    isTyping = false;
}

function restoreCursor() {
    if(isTyping) return;
    process.stdout.write("\033[u"); //restore cursor
    isTyping = true;
}

process.stdout.on('resize', function () {
    console.log('screen size has changed!');
    console.log(process.stdout.columns + 'x' + process.stdout.rows);
});

console.log("isTTY:", process.stdout.isTTY);
if (!process.stdout.isTTY) {
    console.log("TTY only for now");
    process.exit();
}

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');
for(var i = 1; i < process.stdout.rows; i++) {
    process.stdout.write('\n');
}
process.stdout.write("\033[2J"); //Clear the screen, move to bottom left



