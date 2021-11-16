"use strict";

let gameStartScreenInterface = {
    htmlElement: document.querySelector(".game-start-screen"),
    firstShow: true,

    game: undefined,
    mainColor: undefined,

    topElement: document.querySelector(".game-start-screen .top"),
    returnButton: document.querySelector(".game-start-screen .return-button"),
    returnButtonHighlight: document.querySelector(".game-start-screen .return-button-highlight"),
    bottomElement: document.querySelector(".game-start-screen .bottom"),
    backgroundImageElement: document.querySelector(".game-start-screen .top img"),
    backgroundImage: undefined,
    titleElement: document.querySelector(".game-start-screen .bottom .game-title"),
    title: undefined,
    gameDescriptionElement: document.querySelector(".game-start-screen .bottom .game-description"),
    gameDescription: undefined,
    horizontalBarElement: document.querySelector(".game-start-screen .bottom hr"),
    buttonElement: document.querySelector(".game-start-screen .bottom .button"),

    checkBoxElementList: document.querySelectorAll(".game-start-screen .bottom .checkbox"),
    checkBoxObjectList: [],

    show(game, mainColor, hslColorList, backgroundImage, gameTitle, gameDescription, gameConfiguration = null) {
        // ! This "gameConfiguration = null" is to use the same configuration when the game is restarted after the game is over.
        this.game = game;
        this.mainColor = mainColor
        this.hslColorList = hslColorList;
        this.backgroundImage = backgroundImage;
        this.title = gameTitle;
        this.gameDescription = gameDescription;

        this.htmlElement.style.display = "flex";
        this.topElement.lastElementChild.style.display = "flex";
        this.bottomElement.children[0].style.display = "flex";
        this.initialize();
    },

    hide() {
        this.htmlElement.style.display = "none";
    },

    hideContent() {
        this.topElement.lastElementChild.style.display = "none";
        this.bottomElement.children[0].style.display = "none";
    },

    initialize() {
        if (this.firstShow === true) {
            this.firstShow = false;
            this.buttonElement.disabled = false;

            // Build objects to the left and right checkboxes
            const checkBoxElementList = this.checkBoxElementList;
            this.checkBoxObjectList = new CheckBoxListController(checkBoxElementList, false, undefined, undefined, this.buttonElement, false, this.mainColor).build();
            const checkBoxHiragana = this.checkBoxObjectList[0];
            const checkBoxKatakana = this.checkBoxObjectList[1];
            let gameStartScreenControllerObject = new GameStartScreenController(this.buttonElement, this.hslColorList);

            const HeaderControllerObject = new HeaderController(this.returnButtonHighlight, null)

            this.returnButton.addEventListener("click", async () => {
                await HeaderControllerObject.animateButton();
                this.hide();
                menuScreenInterface.show();
            })
            this.buttonElement.addEventListener("click", async () => {
                if (this.buttonElement.disabled === false) {
                    await gameStartScreenControllerObject.animateButton();

                    const allKana = kana.getAll();
                    let cards = [];
                    if (checkBoxHiragana.isChecked === true) {
                        cards.push(kana.toHiragana(allKana));
                    }
                    if (checkBoxKatakana.isChecked === true) {
                        cards.push(kana.toKatakana(allKana));
                    }
                    cards = cards.flat();
                    cards = Cards.shuffle(cards);

                    this.hideContent();
                    const gameConfiguration = {
                        time: 20, dimensionX: 2, dimensionY: 2, bonusTime: 10
                    }
                    this.game.show(cards, gameConfiguration);
                }
            })
        }

        this.backgroundImageElement.src = this.backgroundImage;
        this.titleElement.innerHTML = this.title;
        this.titleElement.style.color = this.mainColor;

        this.gameDescriptionElement.innerHTML = this.gameDescription;
        this.horizontalBarElement.style.borderColor = this.mainColor;

        this.buttonElement.style.backgroundColor = this.mainColor;
    }
}