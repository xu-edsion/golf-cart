const cart = {
  state: {
    show: true,
    cartList: [
      {
        id: '1',
        number: '01',
        type: 'BX-6',
        sitMember: '4',
        remark: '',
        hole: '1',
        state: '1',
        totalTime: '20',
        userName: 'luffy',
        userPhone: '15012605726',
        caddieName: '阿双',
        caddieNumber: '001',
        caddiePhone: '13653787653'
      },
      {
        id: '3',
        hole: '1',
        number: '02',
        type: 'T8',
        sitMember: '3',
        remark: '年检修',
        state: '0',
        totalTime: '30',
        userName: 'zoro',
        userPhone: '15012605726',
        caddieName: '蛋蛋',
        caddieNumber: '002',
        caddiePhone: '13653787653'
      },
      {
        id: '05',
        number: '03',
        sitMember: '3',
        type: 'T8',
        remark: '',
        hole: '2',
        state: '1',
        totalTime: '30',
        userName: 'luffy',
        userPhone: '15012605726',
        caddieName: '阿双',
        caddieNumber: '001',
        caddiePhone: '13653787653'
      },
      {
        id: '6',
        number: '04',
        type: 'BX-7',
        sitMember: '2',
        remark: '年检修',
        hole: '2',
        state: '0',
        totalTime: '60',
        userName: 'luffy',
        userPhone: '15012605726',
        caddieName: '阿双',
        caddieNumber: '001',
        caddiePhone: '13653787653'
      },
      {
        id: '8',
        number: '05',
        type: 'WK-63',
        sitMember: '4',
        remark: '',
        hole: '3',
        state: '1',
        totalTime: '50',
        userName: 'luffy',
        userPhone: '15012605726',
        caddieName: '阿双',
        caddieNumber: '001',
        caddiePhone: '13653787653'
      },
      {
        id: '9',
        number: '06',
        type: 'TC-8',
        sitMember: '4',
        remark: '',
        hole: '3',
        state: '1',
        totalTime: '40',
        userName: 'luffy',
        userPhone: '15012605726',
        caddieName: '阿双',
        caddieNumber: '001',
        caddiePhone: '13653787653'
      }
    ]
  },
  mutations: {
    TOGGLE_SHOW: state => {
      state.show = !state.show
    }
  },
  actions: {
    Toggle_Show: context => {
      context.commit('TOGGLE_SHOW')
    }
  }
}

export default cart
