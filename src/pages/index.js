import { firebase } from "config"
import Head from "next/head"
import React, {useState, useEffect, useCallback} from 'react'
import ListItem from "../ListItem"
import Sidebar from "../Sidebar"
import NavBar from "../NavBar"
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { motion } from "framer-motion"

const Home = ({ alertOnBottom }) => {
  const [products, setProducts] = useState([])
  const [windowDimensions, setWindowDimensions] = useState(1);
  const [ selectedCategory, setSelectedCategory ] = useState(false)
  const [ firstEntry, setFirstEntry ] = useState('')
  const [ firstVisibleDoc, setFirstVisibleDoc ] = useState("");
  const [ lastVisibleDoc, setLastVisibleDoc ] = useState("");
  const [loadMore, setLoadMore] = useState(false);//certain actions are performed in useFirestore.jsx in order to make loadMore properly work
  const [scrollTop, setScrollTop] = useState(0);
  const [ isMush, setIsMush ] = useState(false)
  const [ isMicrodose, setIsMicrodose ] = useState(false)
  const [ isEdible, setIsEdible ] = useState(false)
  const [ isPreroll, setIsPreroll ] = useState(false)
  const [ limit, setLimit ] = useState(20)
  const [ priceMinimum, setPriceMinimum ] = useState('')
  const [ priceMaximum, setPriceMaximum ] = useState('')
  const list = {
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
      }
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren"
      }
    }
  };

//fixed - but needs db entries to match
  const categoryChange = (e) => {
    if(e.target.id === 'mushroom'){
      setIsMush(!isMush)
      if(selectedCategory !== 'mushroom'){setSelectedCategory('mushroom')}
      if(selectedCategory === 'mushroom'){setSelectedCategory(false)}

      if(isMicrodose){setIsMicrodose(!isMicrodose)}
      if(isEdible){setIsEdible(!isEdible)}
      if(isPreroll){setIsPreroll(!isPreroll)}
    }
    else if (e.target.id === 'microdose'){
      setIsMicrodose(!isMicrodose)
      if(selectedCategory !== 'microdose'){setSelectedCategory('microdose')}
      if(selectedCategory === 'microdose'){setSelectedCategory(false)}

      if(isMush){setIsMush(!isMush)}
      if(isEdible){setIsEdible(!isEdible)}
      if(isPreroll){setIsPreroll(!isPreroll)}
    }
    else if (e.target.id === 'edible'){
      setIsEdible(!isEdible)
      if(selectedCategory !== 'edible'){setSelectedCategory('edible')}
      if(selectedCategory === 'edible'){setSelectedCategory(false)}

      if(isMush){setIsMush(!isMush)}
      if(isMicrodose){setIsMicrodose(!isMicrodose)}
      if(isPreroll){setIsPreroll(!isPreroll)}
    }
    else if (e.target.id === 'preroll'){
      setIsPreroll(!isPreroll)
      if(selectedCategory !== 'preroll'){setSelectedCategory('preroll')}
      if(selectedCategory === 'preroll'){setSelectedCategory(false)}

      if(isMush){setIsMush(!isMush)}
      if(isMicrodose){setIsMicrodose(!isMicrodose)}
      if(isEdible){setIsEdible(!isEdible)}
    }
  };

  const minimumChange = (e) => {
    setPriceMinimum(e.target.value)
  }

  const maximumChange = (e) => {
    setPriceMaximum(e.target.value)
  }

  const handleOnDocumentBottom = () => {
    if(products.length % 20 === 0){
      getNextShoes()
    }
  };

  const handleContainerOnBottom = useCallback(() => {
    if (alertOnBottom) {
      alert('Bottom of this container hit!');
    }
  }, [alertOnBottom]);

    /* This will trigger handleOnDocumentBottom when the body of the page hits the bottom */
    useBottomScrollListener(handleOnDocumentBottom);

    /* This will trigger handleOnContainerBottom when the container that is passed the ref hits the bottom */
    const containerRef = useBottomScrollListener(handleContainerOnBottom);

  useEffect(() => {

    let productsRef

    const handleScroll = event => {
      setScrollTop(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    //needs to change to reflect actual database of items
    if(selectedCategory !== false && selectedCategory !== 'jordan'){
      productsRef = firebase.firestore().collection('shoes').where('category', '==', selectedCategory[0].toUpperCase()+selectedCategory.slice(1)).orderBy('price')
    } else if(selectedCategory !== false && selectedCategory === 'jordan'){
      productsRef = firebase.firestore().collection('shoes').where('category', '==', 'Air Jordan').orderBy('price')
    } else {
      productsRef = firebase.firestore().collection('shoes').orderBy('price').where('price', '>=', priceMinimum === '' ? 0 : parseInt(priceMinimum))
      .where('price', '<=', priceMaximum === '' ? 1000 : parseInt(priceMaximum) )

    }

    productsRef
    .limit(limit)
    .onSnapshot(
      querySnapshot => {
        const productsArr = []
        querySnapshot.forEach((product) => {
          productsArr.push({...product.data(), id: product.id})
        })
        setProducts(productsArr)
        setFirstEntry(productsArr[0])
        setFirstVisibleDoc(productsArr[0])
        setLastVisibleDoc(productsArr[productsArr.length-1])
      }
    )

    function handleResize() {
      setWindowDimensions({width:window.innerWidth, height:window.innerHeight});
    }

    handleResize()

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
    }, [selectedCategory, limit, priceMaximum, priceMinimum])

    const getNextShoes = () => {
      let shoesRef
    if(selectedCategory !== false && selectedCategory !== 'jordan'){
      shoesRef = firebase.firestore().collection('shoes').where('category', '==', selectedCategory[0].toUpperCase()+selectedCategory.slice(1))
      .orderBy('title')
    } else if(selectedCategory !== false && selectedCategory === 'jordan'){
      shoesRef = firebase.firestore().collection('shoes').where('category', '==', 'Air Jordan')
      .orderBy('title')
    } else {
      shoesRef = firebase.firestore().collection('shoes').orderBy('price').where('price', '>=', priceMinimum === '' ? 0 : parseInt(priceMinimum))
      .where('price', '<=', priceMaximum === '' ? 1000 : parseInt(priceMaximum))

    }

    shoesRef
    .limit(limit)
    .startAfter(lastVisibleDoc.price)
    .onSnapshot(
      querySnapshot => {
        const shoesArr = []
        querySnapshot.forEach((shoe) => {
          shoesArr.push({...shoe.data(), id: shoe.id})
        })
        setShoes([...shoes,...shoesArr])
        setFirstVisibleDoc(shoesArr[0])
        setLastVisibleDoc(shoesArr[shoesArr.length-1])
      }
      )
    }

    const synposisStyle01 = {
      backgroundColor:'rgba(255,255,255,.75)', width: '300%', marginLeft: '-100%'
    };
    const synposisStyle02 = {
      backgroundColor:'rgba(255,255,255,.75)'
    };

    // console.log(windowDimensions)

  return (
    <div className="w-fit">
      <Head>
        <title>Shoelala</title>
        <meta name="description" content="All Products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='box' ref={containerRef}>
        <NavBar windowDimensions={windowDimensions}/>
        <div className="py-20 px-60 mx-auto"
        style={{
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',backgroundImage: "url(/pexels-erik-mclean-7543637.jpg)" }}>
        <div style={windowDimensions.width < 1024 ? synposisStyle01 : synposisStyle02} className='rounded-md shadow-lg p-5 lg:my-16'>
        <p className='text-center font-bold pb-5 text-xl'> SHOP ALL SNEAKERS</p>
        <p className='text-center text-xs'>The vault goes deep at Shoelala. Shop for new releases from must-have names like Nike, Nike, New Balance and Yeezy, along with the latest collaborations from brands like Vans, Reebok, Converse, ASICS, and more.</p>
        </div>
        </div>

        <div style={{boxShadow: '0px -2px 5px rgba(0,0,0,.5)'}} className="flex flex-col lg:flex-row pt-5 pb-20 w-full bg-slate-100">
        <Sidebar windowDimensions={windowDimensions} priceMaximum={priceMaximum} maximumChange={maximumChange} priceMinimum={priceMinimum} minimumChange={minimumChange} isMush={isMush} isMicrodose={isMicrodose} isEdible={isEdible} isPreroll={isPreroll} categoryChange={categoryChange}/>
        <div>
<motion.ul
    style={windowDimensions.width < 1024 ? {justifyContent:'center'} : null}
    className='flex flex-wrap pb-10 lg:pr-20 max-h-8/10'
    variants={list}
    initial="hidden"
    animate="visible"
  >

{products.map((shoe, index) => {
            return (<ListItem windowDimensions={windowDimensions} key={index} index={index} shoe={shoe}/>)
          })}
  </motion.ul>
        </div>
        </div>
      </main>
    </div>
  )
}

export default Home
