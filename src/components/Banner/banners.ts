import KapexSmallBanner from '../../img/banners/kapex/kapex_small_v3.gif'
import KapexMediumBanner from '../../img/banners/kapex/kapex_medium_v3.gif'
import KapexLargeBanner from '../../img/banners/kapex/kapex_large_v3.gif'
import KodaSmallBanner from '../../img/banners/koda/koda_small_v2.gif'
import KodaMediumBanner from '../../img/banners/koda/koda_medium_v2.gif'
import KodaLargeBanner from '../../img/banners/koda/koda_large_v2.gif'

const BANNERS = {
    kapex: {
        gifs: [KapexLargeBanner, KapexMediumBanner, KapexSmallBanner],
        link: "https://kapex.me/",
        delay: 9500
    },
    koda: {
        gifs: [KodaLargeBanner, KodaMediumBanner, KodaSmallBanner],
        link: "https://koda.finance/",
        delay: 6200
    }
}

export default BANNERS
