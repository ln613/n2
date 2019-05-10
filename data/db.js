module.exports = {
  products: [
    { id: 1, name: 'Nakama S-2', cat: 4, cat1: 1, price: 129, desc: 'Carbon Power With Great Spin For Aggressive Topspin Play' },
    { id: 2, name: 'Lezoline Rifones Shoes', cat: 8, cat1: 1, price: 150, sale: 120, desc: 'Athlete Style Model; The New Choice Of Top Players' },
    { id: 3, name: 'Alshem Fleece', cat: 7, cat1: 3, price: 85, sale: 60, desc: 'Warm and Cozy' },
    { id: 4, name: 'Butterfly 3-Star Ball G40+ 3 pack', cat: 6, cat1: 1, price: 8, desc: 'I.T.T.F. Approved 3-Star Ball' },
    { id: 5, name: 'Amultart ZL Carbon Blade', cat: 3, cat1: 2, price: 249, desc: 'High Performance Model with ZL-Carbon' },
    { id: 6, name: 'Tenergy 5', cat: 5, cat1: 1, price: 80, desc: 'Excellent For Imparting Spin On The Ball' },
  ],
  cats: [
    { id: 1, name: 'New Arrivals', name_ch: '最新产品' },
    { id: 2, name: 'On Sale', name_ch: '促销产品' },
    {
      id: 3, name: 'Blades', name_ch: '球板', subs: [
        { id: 1, name: 'Penhold', name_ch: '直板' },
        { id: 2, name: 'Shakehand', name_ch: '横板' }
      ]
    },
    {
      id: 4, name: 'Rackets', name_ch: '球拍', subs: [
        { id: 1, name: 'Butterfly' },
        { id: 2, name: 'Joola' }
      ]
    },
    {
      id: 5, name: 'Rubbers', name_ch: '胶皮', subs: [
        { id: 1, name: 'Butterfly' },
        { id: 2, name: 'Joola' }
      ]
    },
    {
      id: 6, name: 'Accessories', name_ch: '其它产品', subs: [
        { id: 1, name: 'Balls', name_ch: '球' },
        { id: 2, name: 'Net', name_ch: '球网' },
        { id: 3, name: 'Robot', name_ch: '自动训练器' }
      ]
    },
    {
      id: 7, name: 'Apparel', name_ch: '服装', subs: [
        { id: 1, name: 'Shirts', name_ch: '汗衫' },
        { id: 2, name: 'Shorts', name_ch: '短裤' },
        { id: 3, name: 'Fleece', name_ch: '羊绒外套' }
      ]
    },
    {
      id: 8, name: 'Footwear', name_ch: '鞋', subs: [
        { id: 1, name: 'Shoes', name_ch: '球鞋' },
        { id: 2, name: 'Socks', name_ch: '袜子' }
      ]
    }
  ]
};