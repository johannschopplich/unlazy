import { UnLazyImage } from '../src'

function App() {
  return (
    <>
      <UnLazyImage
        blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
        srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
        autoSizes={true}
        width="640"
        height="640"
      />
      <UnLazyImage
        thumbhash="1QcSHQRnh493V4dIh4eXh1h4kJUI"
        src="/images/sunrise-evan-wallace.jpg"
        width="480"
        height="640"
    />
    </>
  )
}

export default App
