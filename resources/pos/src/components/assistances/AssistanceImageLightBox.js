import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const AssistanceImageLightBox = (props) => {
    const { isOpen, setIsOpen, lightBoxImages } = props;
    const [photoIndex, setPhotoIndex] = useState(0);

    return (
        <div>
            {isOpen && lightBoxImages && lightBoxImages[photoIndex] ? (
                <Lightbox
                    mainSrc={lightBoxImages[photoIndex]}
                    nextSrc={lightBoxImages[(photoIndex + 1) % lightBoxImages.length]}
                    prevSrc={lightBoxImages[(photoIndex + lightBoxImages.length - 1) % lightBoxImages.length]}
                    onCloseRequest={() => setIsOpen(!isOpen)}
                    onMovePrevRequest={() =>
                        setPhotoIndex((photoIndex + lightBoxImages.length - 1) % lightBoxImages.length)
                    }
                    onMoveNextRequest={() =>
                        setPhotoIndex((photoIndex + 1) % lightBoxImages.length)
                    }
                    imageTitle={`Imagen de Asistencia (${photoIndex + 1} de ${lightBoxImages.length})`}
                />
            ) : null}
        </div>
    );
};

export default AssistanceImageLightBox;
