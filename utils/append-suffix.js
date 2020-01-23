const appendSuffix = (key, newExt) => {

    const SUFFIX = 'reduced'
    const nameWithoutExtension = key.split('.')[0];
    return `${nameWithoutExtension}_${SUFFIX}.${newExt}`;
};

module.exports = appendSuffix;
