import KapexSmallBanner from '../../img/banners/kapex_small_v3.gif'
import KapexMediumBanner from '../../img/banners/kapex_medium_v3.gif'
import KapexLargeBanner from '../../img/banners/kapex_large_v3.gif'
import KodaSmallBanner from '../../img/banners/koda_small.gif'
import KodaMediumBanner from '../../img/banners/koda_medium.gif'
import KodaLargeBanner from '../../img/banners/koda_large.gif'

const BANNERS = {
    kapex: {
        gifs: [KapexLargeBanner, KapexMediumBanner, KapexSmallBanner],
        link: "https://kapex.me/",
        delay: 9500
    },
    koda: {
        gifs: [KodaLargeBanner, KodaMediumBanner, KodaSmallBanner],
        link: "https://koda.finance/",
        delay: 6200,
    }
}

export default BANNERS
