(function () {
    var parent = window.parent;
    //dialogå¯¹è±¡
    dialog = parent.$EDITORUI[window.frameElement.id.replace( /_iframe$/, '' )];
    //å½“å‰æ‰“å¼€dialogçš„ç¼–è¾‘å™¨å®žä¾‹
    editor = dialog.editor;

    UE = parent.UE;

    domUtils = UE.dom.domUtils;

    utils = UE.utils;

    browser = UE.browser;

    ajax = UE.ajax;

    $G = function ( id ) {
        return document.getElementById( id )
    };
    //focuså…ƒç´ 
    $focus = function ( node ) {
        setTimeout( function () {
            if ( browser.ie ) {
                var r = node.createTextRange();
                r.collapse( false );
                r.select();
            } else {
                node.focus()
            }
        }, 0 )
    };
    utils.loadFile(document,{
        href:editor.options.themePath + editor.options.theme + "/dialogbase.css?cache="+Math.random(),
        tag:"link",
        type:"text/css",
        rel:"stylesheet"
    });
    lang = editor.getLang(dialog.className.split( "-" )[2]);
    if(lang){
        domUtils.on(window,'load',function () {

            var langImgPath = editor.options.langPath + editor.options.lang + "/images/";
            //é’ˆå¯¹é™æ€èµ„æº
            for ( var i in lang["static"] ) {
                var dom = $G( i );
                if(!dom) continue;
                var tagName = dom.tagName,
                    content = lang["static"][i];
                if(content.src){
                    //clone
                    content = utils.extend({},content,false);
                    content.src = langImgPath + content.src;
                }
                if(content.style){
                    content = utils.extend({},content,false);
                    content.style = content.style.replace(/url\s*\(/g,"url(" + langImgPath)
                }
                switch ( tagName.toLowerCase() ) {
                    case "var":
                        dom.parentNode.replaceChild( document.createTextNode( content ), dom );
                        break;
                    case "select":
                        var ops = dom.options;
                        for ( var j = 0, oj; oj = ops[j]; ) {
                            oj.innerHTML = content.options[j++];
                        }
                        for ( var p in content ) {
                            p != "options" && dom.setAttribute( p, content[p] );
                        }
                        break;
                    default :
                        domUtils.setAttributes( dom, content);
                }
            }
        } );
    }


})();
