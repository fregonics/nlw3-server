import Image from "../models/Image";

const uploads_path = 'http://localhost:3333/uploads/';

export default {
    render(image: Image) {
        return {
            id: image.id,
            url: `${uploads_path}${image.path}`
        }
    },

    renderMany(images: Image[]) {
        return images.map((image) => this.render(image))
    }
}