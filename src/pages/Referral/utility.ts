const isPercentage = (value?: number) => {
    if (!value) return false
    return value >= 0 && value <= 100
}

export default isPercentage