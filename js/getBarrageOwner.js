import 'jquery';
var danmuXml, danmus, pageList, part;

var av, danmu, danmus, parent;

var numberRegex = /[0-9]+/;
var avRegex = /av[0-9]+/;
var partRegex1 = /p[0-9]+/;
var partRegex2 = /p=[0-9]+/;

const ifVideoPage = async() => {
    document.addEventListener('DOMContentLoaded', () => {
        if (location.host == 'www.bilibili.com') {
            if (document.getElementsByClassName('bilibili-player-auxiliary-area').length == 0 && !document.getElementById('danmukuBox')) return;
            document.addEventListener('contextmenu', async(ev) => {
                parent = document.getElementsByClassName("bilibili-player-context-menu-container")[0] || document.getElementsByClassName("player-auxiliary-context-menu-container")[0];
                parent = parent.getElementsByTagName('ul')[0];
                danmu = ev.target.innerText;
                let url = window.location.href;
                av = avRegex.exec(url);
                av = numberRegex.exec(av[0])[0];
                part = partRegex1.exec(url) || partRegex2.exec(url) || [1];
                part = numberRegex.exec(part[0])[0] - 1;
                if (!document.getElementById('scanner')) {
                    pageList = await $.get('https://api.bilibili.com/x/player/pagelist?aid=' + av + '&jsonp=jsonp', (html) => {});
                    danmuXml = await $.get('https://api.bilibili.com/x/v1/dm/list.so?oid=' + pageList.data[part].cid, (html) => {});
                    danmus = danmuXml.getElementsByTagName('d');
                    addLI(parent);
                }
            })
        }

    })

}
const addLI = (parent) => {
    let scanUser = document.createElement('li');
    scanUser.innerHTML += "<a class='context-menu-a js-action' id='scanner'>查看弹幕发送者空间<\/a>";
    scanUser.setAttribute('class', 'context-line context-menu-function');
    parent.appendChild(scanUser);
    let scanner = document.getElementById('scanner');
    scanner.addEventListener('click', (ev) => { openOwner(ev) })
}

const openOwner = async(ev) => {
    let target = ev.target || ev.srcElement;
    if (target.id.toLowerCase() == "scanner") {
        let tmp = await Array.prototype.filter.call(danmus, i => i.innerHTML == danmu);
        tmp = tmp[0].attributes.p.nodeValue.split(',')[6];
        tmp = await $.get('https://biliquery.typcn.com/api/user/hash/' + tmp, (html) => {});
        tmp = JSON.parse(tmp)
        if (tmp.data.length == 1)
            window.open('http://space.bilibili.com/' + tmp.data[0].id);
        else window.open('http://space.bilibili.com/' + tmp.data[tmp.data.length - 1].id);
    }
}
ifVideoPage();