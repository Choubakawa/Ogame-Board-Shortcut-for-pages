// ==UserScript==
// @name         Ogame Board: Shortcut for pages
// @namespace    https://openuserjs.org/scripts/Choubakawa/Ogame_Board_Shortcut_for_pages
// @version      0.3
// @description  Add links to pages under topic name
// @author       Choubakawa
// @include      https://board.*.ogame.gameforge.com*
// @supportURL   https://github.com/Choubakawa/Ogame-Board-Shortcut-for-pages/issues
// @updateURL    https://openuserjs.org/meta/Choubakawa/Ogame_Board_Shortcut_for_pages.meta.js
// @downloadURL  https://openuserjs.org/install/Choubakawa/Ogame_Board_Shortcut_for_pages.user.js
// @grant        none
// @run-at       document-end
// @licence MIT
// ==/UserScript==

let lang = {};

if( window.location.href.indexOf( "https://board.fr" ) > -1 ) {
    lang = {
        prompt : "Entrer le numéro de la page",
        page : "Aller à la page : "
    }
} else {
    lang = {
        prompt : "Enter the page number",
        page : "Go to the page : "
    }
}

function pages() {
    let table = document.getElementsByClassName( "tabularList" )[0];
    if( table !== undefined ) {
        let infos = table.getElementsByClassName( "messageGroupInfo" );
        let subjectsForum = table.getElementsByClassName( "messageGroupLink wbbTopicLink" );
        let subjects = [];
        if( subjectsForum.length > 0 ) {
            for (var s = 0; s < subjectsForum.length; s++) {
                var subject = subjectsForum[s].href.replace( "&action=firstNew", "" );
                subjects.push( subject );
            }
        }
        let responses = table.getElementsByClassName( "messageGroupListStatsSimple" );
        let responsesPageNumber= [];
        if( responses.length > 0 ) {
            for (var i = 0; i < responses.length; i++) {
                var response = {
                    response: responses[i].textContent,
                    lastPage: Math.floor( responses[i].textContent / 20 ) + 1
                }
                responsesPageNumber.push( response );
            }
        }
        if( infos.length > 0 ) {
            for (var j = 0; j < infos.length; j++) {
                if( responsesPageNumber[j].lastPage > 1 ) {
                    let elementPage = document.createElement( "li" );
                    elementPage.setAttribute( "class", "messageGroupPage" );
                    let pagination = document.createElement( "span" );

                    let pageOne = document.createElement( "a" );
                    pageOne.setAttribute( "href", subjects[j] + "&pageNo=1" )
                    pageOne.appendChild( document.createTextNode( "1 " ) );
                    pagination.appendChild( pageOne );

                    if( responsesPageNumber[j].lastPage > 2 ) {
                        let pageMiddle = document.createElement( "a" );
                        pageMiddle.appendChild( document.createTextNode( " ... " ) );
                        pageMiddle.setAttribute( "base", subjects[j] );
                        pageMiddle.addEventListener( "click", function() {
                            let page = prompt( lang.prompt );
                            if( page == null || page.trim() == "" ) {
                            	return;
                            }
                            page = page.trim();
                            if( !isNaN( page ) ) {
                                window.location = this.getAttribute( "base" ) + "&pageNo=" + page;
                            }
                        });
                        pagination.appendChild( pageMiddle );
                    }

                    let pageLast = document.createElement( "a" );
                    pageLast.setAttribute( "href", subjects[j] + "&pageNo=" + responsesPageNumber[j].lastPage )
                    pageLast.appendChild( document.createTextNode( " " + responsesPageNumber[j].lastPage ) );
                    pagination.appendChild( pageLast );

                    elementPage.appendChild( document.createTextNode( lang.page ) );
                    elementPage.appendChild( pagination );

                    infos[j].appendChild( elementPage );
                }
            }
        }
    }
}
pages();