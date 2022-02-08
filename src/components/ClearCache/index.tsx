import React, { useState, useEffect } from "react"
import packageJson from "../../../package.json"

function buildDateGreaterThan(latestDate, currentDate): boolean {
  const momLatestDateTime = BigInt(latestDate)
  const momCurrentDateTime = BigInt(currentDate)

  return momLatestDateTime > momCurrentDateTime
}

function withClearCache(Component) {
  function ClearCacheComponent(props) {
    const [isLatestBuildDate, setIsLatestBuildDate] = useState(false)

    useEffect(() => {
      fetch("/meta.json")
        .then((response) => response.json())
        .then((meta) => {
          const latestVersionDate = meta.buildDate
          const currentVersionDate = packageJson.buildDate

          const shouldForceRefresh = buildDateGreaterThan(
            latestVersionDate,
            currentVersionDate
          )
          if (shouldForceRefresh) {
            setIsLatestBuildDate(false)
            refreshCacheAndReload()
          } else {
            setIsLatestBuildDate(true)
          }
        })
    }, [])

    const refreshCacheAndReload = () => {
      if (caches) {
        // Service worker cache should be cleared with caches.delete()
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name)
          })
        })
      }
      // delete browser cache and hard reload
      // eslint-disable-next-line
      window.location.href = window.location.href
    }

    return (
      <>
        {isLatestBuildDate ? <Component {...props} /> : null}
      </>
    )
  }

  return ClearCacheComponent
}

export default withClearCache