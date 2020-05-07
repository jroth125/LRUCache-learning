const {expect} = require('chai')
const LRUCache = require('./lru-cache')


describe('test1', () => {
    const cache1 = new LRUCache(4)
    cache1.insertKeyValuePair('a', 'Im an A')
    cache1.insertKeyValuePair('b', 'Im a B')
    cache1.insertKeyValuePair('c', 'Im a C')
    it('correctly identifies the most recently used node', () => {
        expect(cache1.getValueFromKey('d')).to.equal(null)
        expect(cache1.getValueFromKey('a')).to.equal('Im an A')
        expect(cache1.getMostRecentKey()).to.equal('a')
        cache1.insertKeyValuePair('m', 'Im an M')
        expect(cache1.getMostRecentKey()).to.equal('m')
    })

    it('evicts the least recently used key', () => {
        cache1.insertKeyValuePair('d', 'Im a D')
        cache1.insertKeyValuePair('e', 'Im an E')
        expect(cache1.getValueFromKey('b')).to.equal(null)
    })

    it('changes the value of a key', () => {
        expect(cache1.getValueFromKey('d')).to.equal('Im a D')
        expect(cache1.getValueFromKey('e')).to.equal('Im an E')
        cache1.insertKeyValuePair('e', 'I used to be an E')
        expect(cache1.getMostRecentKey()).to.equal('e')
        expect(cache1.getValueFromKey('e')).to.equal('I used to be an E')
    })
})

describe('test2', () => {
    const cache2 = new LRUCache(1)

    it('works when max length is 1', ()=> {
        cache2.insertKeyValuePair('a', 'Im an A')
        expect(cache2.getMostRecentKey()).to.equal('a')
        cache2.insertKeyValuePair('b', 'Im a B')
        cache2.insertKeyValuePair('c', 'Im a C')
        expect(cache2.getMostRecentKey()).to.equal('c')
        expect(cache2.getValueFromKey('a')).to.equal(null)
        expect(cache2.getValueFromKey('b')).to.equal(null)
    })
    it ('works with lots of inputs', () => {
        let chars = 'abcdefghijklmnopqrstuvwxyz)(*&^%$#@!'.split('')
        chars.forEach(char => {
            cache2.insertKeyValuePair(char, `Im a ${char}`)
            expect(cache2.getMostRecentKey()).to.equal(char)
        })
        expect(cache2.getMostRecentKey()).to.equal('!')
        expect(cache2.getValueFromKey('!')).to.equal('Im a !')
        expect(cache2.getValueFromKey('&')).to.equal(null)
    })
})


describe('test3 - performance speed', () => {
    let bigCache = new LRUCache(100000)
    it('quickly looks up objects in a short cache', () => {
        for (let i = 0; i < 100001; i++) {
            bigCache.insertKeyValuePair(i, `I'm a ${i}`)
        }
        const timeBefore = Date.now()
        const val = bigCache.getValueFromKey(23003)
        expect((Date.now() - timeBefore)/1000).to.be.below(.00000001)
        expect(val).to.equal(`I'm a 23003`)
    })

    it('gets the LRU val quickly', () => {
        const timeBefore = Date.now()
        expect(bigCache.getMostRecentKey()).to.equal(23003)
        expect(Date.now() - timeBefore).to.be.below(0.0000001)
    })
})