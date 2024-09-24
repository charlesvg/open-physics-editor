export class ResponsiveStage {
    #stage;

    constructor(stage) {
        this.#stage = stage;
        this.#fitStageIntoParentContainer();
        // adapt the stage on any window resize
        window.addEventListener('resize', this.#fitStageIntoParentContainer);
    }

    #fitStageIntoParentContainer() {
        const container = document.querySelector('#kontainer');
        container.style.width = '100%';
        container.style.height = '100%';

        // now we need to fit stage into parent container
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // but we also make the full scene visible
        // so we need to scale all objects on canvas
        // var scale = containerWidth / sceneWidth;

        this.#stage.width(containerWidth);
        this.#stage.height(containerHeight);
        // stage.scale({ x: scale, y: scale });


        window.dispatchEvent(new CustomEvent("ops.resize", {detail: {width: containerWidth, height: containerHeight}}));


    }
}