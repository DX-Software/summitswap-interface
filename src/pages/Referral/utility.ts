export const isPercentage = (value?: number) => {
    if (!value) return false
    return value >= 0 && value <= 100
}

export const isdecimals = (value?: number) => {
    if (!value) return false
    const regex = /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/
    return !!`${value}`.match(regex)
}

