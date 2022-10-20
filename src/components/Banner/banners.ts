import KodaSmallBanner from '../../img/banners/koda/koda_small_v2.gif'
import KodaMediumBanner from '../../img/banners/koda/koda_medium_v2.gif'
import KodaLargeBanner from '../../img/banners/koda/koda_large_v2.gif'
import EndgameSmallBanner from '../../img/banners/endgame/endgame_small.gif'
import EndgameMediumBanner from '../../img/banners/endgame/endgame_medium.gif'
import EndgameLargeBanner from '../../img/banners/endgame/endgame_large.gif'

const BANNERS = {
    koda: {
        gifs: [KodaLargeBanner, KodaMediumBanner, KodaSmallBanner],
        link: "https://koda.finance/",
        delay: 6200
    },
    endgame: {
        gifs: [EndgameLargeBanner, EndgameMediumBanner, EndgameSmallBanner],
        link: "https://summitswap.finance/#/swap?output=0x373e4b4E4D328927bc398A9B50e0082C6f91B7bb",
        delay: 5200
    },

}

export default BANNERS
