import { UnLazyImage } from '../src'

function App() {
  return (
    <>
      <UnLazyImage
        thumbhash="1QcSHQRnh493V4dIh4eXh1h4kJUI"
        autoSizes={true}
        data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
        width="640"
        height="640"
      />
      <UnLazyImage
        blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
        autoSizes={true}
        data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
        width="640"
        height="640"
      />
    </>
  )
}

export default App
