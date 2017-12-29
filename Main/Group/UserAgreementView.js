/**
 * Created by Arlen_JY on 2017/12/28.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    Picker,
    AsyncStorage,
    TextInput,
    ScrollView,
    Alert,
} from 'react-native';

import NavBar from '../../common/NavBar'
import HttpRequest from '../../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions'
import Welcome from '../../Login/Welcome'
var Global = require('../../common/globals');
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import NewProductCategoryView from '../Product/NewProductCategoryView'

export default class UserAgreementView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            UserAgreementDataArr:[],


        };

    }


    back() {
        this.props.navigator.pop()
    }
    componentWillMount(){
        this.getUserAgreement();


    }
    getUserAgreement(){
        //序章
        var PrologueHeader ={ desc:'《爱邻购许可及服务协议》（以下简称“本协议”）由您与爱邻购服务提供方共同缔结' +
            '，本协议具有合同效力。请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制爱邻购责任的条款（以下称“免责条款”）、对用户权' +
        '利进行限制的条款（以下称“限制条款”）、约定争议解决方式和司法管辖的条款，以及开通或使用某项服务的单独协议。前述免责、限制及争议解' +
        '决方式和管辖条款可能以黑体加粗、颜色标记或其他合理方式提示您注意，包括但不限于本协议第二条、第三条、第四条、第六条、第九条等相关条款' +
        '，您对该等条款的确认将可能导致您在特定情况下的被动、不便、损失，请您在确认同意本协议之前或在使用爱邻购服务之前再次阅读前述条款。双方确认' +
        '前述条款并非属于《合同法》第40条规定的“免除其责任、加重对方责任、排除对方主要权利的”的条款，并同意该条款的合法性及有效性。',fontFamily:'Medium'} ;

        var PrologueFooter = { desc:'除非您已阅读并接受本协议所有条款，否则您无权使用爱邻购服务。如果您对本协议或爱邻购服务有意见或建议，可与腾讯客户服务' +
        '部门联系，我们会给予您必要的帮助。您点击同意、接受或下一步，或您注册、使用爱邻购服务均视为您已阅读并同意签署本协议。',fontFamily:'Medium'} ;
        var FirstPrologueArr = [PrologueHeader,PrologueFooter];
        this.state.UserAgreementDataArr.push(FirstPrologueArr)

        //第一章
        var ChapterOneTitle ={ desc:'一、【定义】',fontFamily:'Medium'} ;
        var ChapterOne1_1 ={ desc:'1.1 使用规则',fontFamily:'Regular'} ;
        var ChapterOne1_1_desc ={ desc:'指爱邻购平台提供方不时发布并修订的关于爱邻购的用户守则、平台公告、提示及通知等内容。',fontFamily:'Regular'} ;
        var ChapterOne1_2 ={ desc:'1.2 爱邻购服务提供方',fontFamily:'Regular'} ;
        var ChapterOne1_2_desc ={ desc:'指向您提供爱邻购服务及其服务的爱特联科技有限公司，在本协议中简称为“爱邻购”。',fontFamily:'Regular'} ;
        var ChapterOne1_3 ={ desc:'1.3 爱邻购服务',fontFamily:'Regular'} ;
        var ChapterOne1_3_desc ={ desc:'指爱邻购向您提供的与平台使用相关的各项在线运营服务。',fontFamily:'Regular'} ;
        var ChapterOne1_4 ={ desc:'1.4 您',fontFamily:'Regular'} ;
        var ChapterOne1_4_desc ={ desc:'又称“团长”，指被授权使用爱邻购及其服务的自然人。',fontFamily:'Regular'} ;
        var ChapterOne1_5 ={ desc:'1.5 爱邻购数据',fontFamily:'Regular'} ;
        var ChapterOne1_5_desc ={ desc:'指您在使用爱邻购平台过程中产生的被服务器记录的各种数据，包括但不限于用户数据、行为日志、购买日志等数据。',fontFamily:'Regular'} ;

        var ChapterOneArr = [ChapterOneTitle,
            ChapterOne1_1,ChapterOne1_1_desc,
            ChapterOne1_2,ChapterOne1_2_desc,
            ChapterOne1_3,ChapterOne1_3_desc,
            ChapterOne1_4,ChapterOne1_4_desc,
            ChapterOne1_5,ChapterOne1_5_desc]
        this.state.UserAgreementDataArr.push(ChapterOneArr)


        //第二章
        var ChapterTwoTitle ={ desc:'二、【爱邻购账号】',fontFamily:'Medium'} ;
        var ChapterTwo2_1 ={ desc:'2.1 您如果需要使用和享受爱邻购服务，则您需要将您享有使用权的微信账号作为登录账号。您对微信账号的申请、使用等行' +
        '为应符合腾讯不时修订并公布的《腾讯服务协议》和《腾讯微信软件许可及服务协议》的规范。',fontFamily:'Regular'} ;
        var ChapterTwo2_1_desc ={ desc:'在使用爱邻购平台服务时，您应当按爱邻购平台页面的提示准确完整地提供您的信息（包括您的姓名及邮编、联系电话、联' +
        '系地址等），以便爱邻购或其他用户与您联系。您了解并同意，您有义务保持您提供信息的真实性及有效性。否则，爱邻购有权终止为您提供爱邻购平台服务' +
        '，并有权对您的用户账号采取包括但不限于警告、限制或禁止使用帐号全部或部分功能、删除账号及数据、删除相关信息、账号封禁（以下有时简称“封号”）' +
        '直至注销的处理措施（为描述方便，以下有时也将该等处理措施称为“处罚”），因此造成的一切后果由您自行承担。',fontFamily:'Regular'} ;
        var ChapterTwo2_2 ={ desc:'2.2 您理解并同意，您不得将爱邻购账号以任何方式提供给他人使用。否则，因此产生任何法律后果及责任均由您自行承担，且爱邻购有权对您' +
        '的账号采取包括但不限于警告、限制或禁止使用爱邻购帐号全部或部分功能、删除账号及数据及其他相关信息、封号直至注销的处理措施，因此造成的' +
        '一切后果由您自行承担。',fontFamily:'Medium'} ;



        var ChapterTwoArr = [ChapterTwoTitle,
            ChapterTwo2_1,ChapterTwo2_1_desc,
            ChapterTwo2_2,]
        this.state.UserAgreementDataArr.push(ChapterTwoArr)

        //第三章

        var ChapterThreeTitle ={ desc:'三、【用户信息收集、使用及保护】',fontFamily:'Medium'} ;

        var ChapterThree3_1_desc ={ desc:'3.1 您同意并授权爱邻购为履行本协议之目的收集您的用户信息，这些信息包括您在微信上的用户名以及您账号下的数据以及其他您在' +
        '使用爱邻购的过程中向爱邻购提供基于安全、用户体验优化等考虑而需收集的信息，爱邻购对您的用户信息的收集将遵循本协议及相关法律的规定' +
        '。',fontFamily:'Regular'} ;

        var ChapterThree3_2_desc ={ desc:'3.2 您理解并同意：为了更好地向您提供爱邻购服务，改善平台使用体验，爱邻购可对您微信账号中的昵称' +
        '、头像以及在爱邻购平台的相关操作信息等信息（以下称“该等信息”。该等信息具体包括但不限于您的登录状态、开团信息/状态、截团状态，通知取货' +
        '信息等）进行使用，并可向您本人或其他用户或好友展示该等信息。',fontFamily:'Regular'} ;
        var ChapterThree3_3_desc ={ desc:'3.3 您应对通过爱邻购平台及相关服务了解、接收或可接触到的包括但不限于其他用户在内的任何人的个人' +
        '信息予以充分尊重，您不应以搜集、复制、存储、传播或以其他任何方式使用其他用户的个人信息，否则，由此产生的后果由您自行承担' +
        '。',fontFamily:'Regular'} ;
        var ChapterThree3_4_desc ={ desc:'3.4保护用户信息及隐私是爱邻购的一项基本原则。除本协议另有规定外，爱邻购服务对用户信息收集' +
        '、使用及保护等将遵循腾讯统一公布的相关隐私政策。',fontFamily:'Medium'} ;


        var ChapterThreeArr = [ChapterThreeTitle,
            ChapterThree3_1_desc,ChapterThree3_2_desc,
            ChapterThree3_3_desc,ChapterThree3_4_desc]
        this.state.UserAgreementDataArr.push(ChapterThreeArr)
        //第四章
        //
        var ChapterFourTitle ={ desc:'四、【爱邻购服务】',fontFamily:'Medium'} ;

        var ChapterFour4_1_desc ={ desc:'4.1 本条及本协议其他条款未明示授权的其他一切权利仍由爱邻购保留，您在行使这些权利时须另外取得爱' +
        '邻购的书面许可。',fontFamily:'Regular'} ;

        var ChapterFour4_2_desc ={ desc:'4.2 如果您违反本协议约定的，爱邻购有权采取相应的措施进行处理，该措施包括但不限于：不经通知随时对相关内容进行删除，并视行' +
        '为情节对违规账号处以包括但不限于警告、限制或禁止使用全部或部分功能、账号封禁直至注销的处罚，并公告处理结果，要求您赔偿因您从事违约行为' +
        '而给爱邻购造成的损失等。',fontFamily:'Regular'} ;
        var ChapterFour4_3_desc ={ desc:'4.3 您充分理解并同意，爱邻购有权依合理判断对违反有关法律法规或本协议规定的行为进行处理，对违法违规的任何用户采取适当的' +
        '法律行动，并依据法律法规保存有关信息向有关部门报告等，用户应独自承担由此而产生的一切法律责任。',fontFamily:'Regular'} ;
        var ChapterFour4_4_desc ={ desc:'4.4 您充分理解并同意，因您违反本协议或相关服务条款的规定，导致或产生第三方主张的任何索赔、要' +
        '求或损失，您应当独立承担责任；爱邻购因此遭受损失的，您也应当一并赔偿。',fontFamily:'Regular'} ;
        var ChapterFour4_5_desc ={ desc:'4.5 在任何情况下，爱邻购不对因不可抗力导致的您在使用软件服务过程中遭受的损失承担责任。该等不可' +
        '抗力事件包括但不限于国家法律、法规、政策及国家机关的命令及其他政府行为或者其它的诸如地震、水灾、雪灾、火灾、海啸、台风、罢工、战争' +
        '等不可预测、不可避免且不可克服的事件。',fontFamily:'Regular'} ;
        var ChapterFour4_6_desc ={ desc:'4.6 爱邻购可能因软件BUG、版本更新缺陷、第三方病毒攻击或其他任何因素导致您的账号数据发生异' +
        '常。在数据异常的原因未得到查明前，爱邻购有权暂时冻结该用户账号；若查明数据异常为非正常行为所致，爱邻购有权恢复账号数据至异常发生前' +
        '的原始状态，且爱邻购无须向您承担任何责任。',fontFamily:'Medium'} ;
        var ChapterFour4_7_desc ={ desc:'4.7 爱邻购自行决定终止运营爱邻购时或爱邻购因其他任何原因终止运营时，爱邻购会按照文化部有关' +
        '运营的相关规定处理终止运营相关事宜，以保障用户合法权益。',fontFamily:'Medium'} ;


        var ChapterFourArr = [ChapterFourTitle,
            ChapterFour4_1_desc,ChapterFour4_2_desc,
            ChapterFour4_3_desc,ChapterFour4_4_desc
            ,ChapterFour4_5_desc,ChapterFour4_6_desc
            ,ChapterFour4_7_desc]
        this.state.UserAgreementDataArr.push(ChapterFourArr)
        // 第五章
        //
        var ChapterFiveTitle ={ desc:'五、【软件许可】',fontFamily:'Medium'} ;
        var ChapterFive5_1_desc ={ desc:'5.1 爱邻购可能为不同的终端设备或操作系统开发了不同的软件版本，包括但不限于ios、android等多' +
        '个应用版本，您应当根据实际情况选择下载合适的版本进行安装，下载安装程序后，您需要按照该程序提示的步骤正确安装。',fontFamily:'Medium'} ;
        var ChapterFive5_2_desc ={ desc:'5.2 为提供更加优质、安全的服务，在软件安装时爱邻购可能推荐您安装其他软件，您可以选择安装或不安' +
        '装。',fontFamily:'Regular'} ;
        var ChapterFive5_3_desc ={ desc:'5.3 如果您不再需要使用该软件或者需要安装新版，可以自行卸载。如果您愿意帮助爱邻购改进产品服务，' +
        '请告知卸载的原因。',fontFamily:'Regular'} ;
        var ChapterFive5_4_desc ={ desc:'5.4 为了保证爱邻购服务的安全性和功能的一致性，爱邻购有权对软件进行更新，或者对软件的部分功能效果进' +
        '行改变或限制。',fontFamily:'Regular'} ;
        var ChapterFive5_5_desc ={ desc:'5.5 软件新版本发布后，旧版本的软件可能无法使用。爱邻购不保证旧版本软件继续可用及相应的客户服务' +
        '，请您随时核对并下载最新版本。',fontFamily:'Regular'} ;

        var ChapterFiveArr = [ChapterFiveTitle,
            ChapterFive5_1_desc,ChapterFive5_2_desc,
            ChapterFive5_3_desc,ChapterFive5_4_desc,ChapterFive5_5_desc]
        this.state.UserAgreementDataArr.push(ChapterFiveArr)
        // //第六章
        //
        var ChapterSixTitle ={ desc:'六、【用户行为规范】',fontFamily:'Medium'} ;
        var ChapterSix6_1_desc ={ desc:'6.1 您充分了解并同意，您必须为自己账号下的一切行为负责，包括您所发表的任何内容以及由此产' +
        '生的任何后果。',fontFamily:'Regular'} ;
        var ChapterSix6_2desc ={ desc:'6.2 您在使用爱邻购或爱邻购服务时须遵守法律法规，不得利用爱邻购或爱邻购服务从事违法违规行' +
        '为，包括但不限于以下行为：',fontFamily:'Medium'} ;
        var ChapterSix6_2_1desc ={ desc:'（一）违反宪法确定的基本原则的；',fontFamily:'Medium'} ;
        var ChapterSix6_2_2desc ={ desc:'（二）危害国家统一、主权和领土完整的；',fontFamily:'Medium'} ;
        var ChapterSix6_2_3desc ={ desc:'（三）泄露国家秘密、危害国家安全或者损害国家荣誉和利益的；',fontFamily:'Medium'} ;
        var ChapterSix6_2_4desc ={ desc:'（四）煽动民族仇恨、民族歧视，破坏民族团结，或者侵害民族风俗、习惯的；',fontFamily:'Medium'} ;
        var ChapterSix6_2_5desc ={ desc:'（五）宣扬邪教、迷信的；',fontFamily:'Medium'} ;
        var ChapterSix6_2_6desc ={ desc:'（六）散布谣言，扰乱社会秩序，破坏社会稳定的；',fontFamily:'Medium'} ;
        var ChapterSix6_2_7desc ={ desc:'（七）宣扬淫秽、色情、赌博、暴力，或者教唆犯罪的；',fontFamily:'Medium'} ;
        var ChapterSix6_2_8desc ={ desc:'（八）侮辱、诽谤他人，侵害他人合法权益的；',fontFamily:'Medium'} ;
        var ChapterSix6_2_9desc ={ desc:'（九）违背社会公德的；',fontFamily:'Medium'} ;
        var ChapterSix6_2_10desc ={ desc:'（十）有法律、行政法规和国家规定禁止的其他内容的。',fontFamily:'Medium'} ;
        var ChapterSix6_2_11desc ={ desc:'（十一） 利用爱邻购平台私下出售违禁品或不符合法律规定的商品的。',fontFamily:'Medium'} ;

        var ChapterSix6_3desc ={ desc:'6.3 除非法律允许或爱邻购书面许可，您不得从事下列行为：',fontFamily:'Medium'} ;
        var ChapterSix6_3_1desc ={ desc:'（1）删除软件及其副本上关于著作权的信息；',fontFamily:'Medium'} ;
        var ChapterSix6_3_2desc ={ desc:'（2）对软件进行反向工程、反向汇编、反向编译或者以其他方式尝试发现软件的源代码；',fontFamily:'Medium'} ;
        var ChapterSix6_3_3desc ={ desc:'（3）对软件进行扫描、探查、测试，以检测、发现、查找其中可能存在的BUG或弱点；',fontFamily:'Medium'} ;
        var ChapterSix6_3_4desc ={ desc:'（4）修改或伪造软件运行中的指令、数据，增加、删减、变动软件的功能或运行效果，或者将用于' +
        '上述用途的软件、方法进行运营或向公众传播，无论上述行为是否为商业目的；',fontFamily:'Medium'} ;
        var ChapterSix6_3_5desc ={ desc:'（5）建立有关爱邻购的镜像站点，或者进行网页（络）快照，或者利用架设服务器等方式，为他人提供与' +
        '爱邻购服务完全相同或者类似的服务；',fontFamily:'Medium'} ;
        var ChapterSix6_3_6desc ={ desc:'（6）使用、修改或遮盖爱邻购的名称、商标或其它知识产权；',fontFamily:'Medium'} ;
        var ChapterSix6_3_7desc ={ desc:'（7）其他未经爱邻购明示授权的行为。',fontFamily:'Medium'} ;

        var ChapterSix6_4desc ={ desc:'6.4 您知悉并同意，如爱邻购依据本协议对您的游戏账号采取封号处理措施的，具体封号期间' +
        '由爱邻购根据您违规行为情节而定。',fontFamily:'Medium'} ;
        var ChapterSix6_4warn ={ desc:'您知悉并同意：',fontFamily:'Regular'} ;
        var ChapterSix6_4_1desc ={ desc:'（1）在封号期间，您的账号无法登陆爱邻购APP；',fontFamily:'Medium'} ;
        var ChapterSix6_4_2desc ={ desc:'（2）因无法登陆爱邻购APP而导致的损失。据此，您也同意不会因发生前述第（1）' +
        '和（或）第（2）点规定的情形而追究爱邻购任何法律责任。',fontFamily:'Medium'} ;

        var ChapterSixArr = [ChapterSixTitle,
            ChapterSix6_1_desc,ChapterSix6_2desc,ChapterSix6_2_1desc,
            ChapterSix6_2_2desc,ChapterSix6_2_3desc,ChapterSix6_2_4desc,
            ChapterSix6_2_5desc,ChapterSix6_2_6desc,ChapterSix6_2_7desc,
            ChapterSix6_2_8desc,ChapterSix6_2_9desc,ChapterSix6_2_10desc,
            ChapterSix6_2_11desc,ChapterSix6_3desc,ChapterSix6_3_1desc,
            ChapterSix6_3_2desc,ChapterSix6_3_3desc,ChapterSix6_3_4desc
            ,ChapterSix6_3_5desc,ChapterSix6_3_6desc,ChapterSix6_3_7desc,
            ChapterSix6_4desc,ChapterSix6_4warn,ChapterSix6_4_1desc,ChapterSix6_4_2desc
        ]
        this.state.UserAgreementDataArr.push(ChapterSixArr)

        //第七章
        var ChapterSevenitle ={ desc:'七、【知识产权】',fontFamily:'Medium'} ;
        var ChapterSeven7_1_desc ={ desc:'7.1 爱特联是爱邻购的知识产权权利人。爱邻购（包括爱邻购整体及爱邻购涉及的所有内容、组成部' +
        '分或构成要素 ）的一切著作权、商标权、专利权、商业秘密等知识产权及其他合法权益，以及与爱邻购相关的所有信息内容（包括文字、图片、' +
        '音频、视频、图表、界面设计、版面框架、有关数据或电子文档等）均受中华人民共和国法律法规和相应的国际条约保护，爱邻购享有上述知识产权' +
        '和合法权益，但相关权利人依照法律规定应享有的权利除外。未经爱邻购事先书面同意，您不得以任何方式将爱邻购（包括爱邻购整体及爱邻购涉及的' +
        '所有内容、组成部分或构成要素 ）进行商业性使用。',fontFamily:'Medium'} ;


        var ChapterSevenArr = [ChapterSevenitle,
            ChapterSeven7_1_desc,]
        this.state.UserAgreementDataArr.push(ChapterSevenArr)

        //第八章
        var ChapterEightTitle ={ desc:'八、【遵守当地法律监管】',fontFamily:'Medium'} ;
        var ChapterEight8_1_desc ={ desc:'8.1 您在使用爱邻购服务过程中应当遵守当地相关的法律法规，并尊重当地的道德和风俗习惯。如果您的行' +
        '为违反了当地法律法规或道德风俗，您应当为此独立承担责任。',fontFamily:'Medium'} ;
        var ChapterEight8_2_desc ={ desc:'8.2 您在使用爱邻购APP所发布的商品，应当符合当地的该类产品符合售卖的标准，当团长自己在平台上发布的' +
        '商品，其商品的质量规格应当由发布商品的团长个人负责，爱邻购平台只对平台售卖的商品负责。',fontFamily:'Medium'} ;
        var ChapterEight8_3_desc ={ desc:'8.3 团长将不允许在平台上售卖不符合新加坡法律法规的商品，否则爱邻购有权暂停或终止对您的服务。',fontFamily:'Medium'} ;
        var ChapterEight8_4_desc ={ desc:'8.4 您应避免因使用爱邻购服务而使爱邻购卷入政治和公共事件，否则爱邻购有权暂停或终止对您的服务。',fontFamily:'Regular'} ;


        var ChapterEightArr = [ChapterEightTitle,
            ChapterEight8_1_desc,ChapterEight8_2_desc,
            ChapterEight8_3_desc,ChapterEight8_4_desc]
        this.state.UserAgreementDataArr.push(ChapterEightArr)


        //第九章
        var ChapterNineTitle ={ desc:'九、【管辖与法律适用】',fontFamily:'Medium'} ;
        var ChapterNine9_1_desc ={ desc:'9.1 本协议适用于新加坡和中国，将遵循新加坡法律法规和中国法律。',fontFamily:'Medium'} ;
        var ChapterNine9_2_desc ={ desc:'9.2 本协议的成立、生效、履行、解释及纠纷解决，适用中华人民共和国大陆地区法律（不包括冲突法）。',fontFamily:'Medium'} ;
        var ChapterNine9_3_desc ={ desc:'9.3 若您和爱邻购之间因本协议发生任何纠纷或争议，首先应友好协商解决；协商不成的，您同意将纠纷或争议提交至本协议签订地有管' +
        '辖权的人民法院管辖。',fontFamily:'Medium'} ;
        var ChapterNine9_4_desc ={ desc:'9.4 本协议所有条款的标题仅为阅读方便，本身并无实际涵义，不能作为本协议涵义解释的依据。',fontFamily:'Regular'} ;
        var ChapterNine9_5_desc ={ desc:'9.5 本协议条款无论因何种原因部分无效，其余条款仍有效，对各方具有约束力。',fontFamily:'Regular'} ;


        var ChapterNineArr = [ChapterNineTitle,
            ChapterNine9_1_desc,ChapterNine9_2_desc,
            ChapterNine9_3_desc,ChapterNine9_4_desc,ChapterNine9_5_desc]
        this.state.UserAgreementDataArr.push(ChapterNineArr)


        //第十章
        var ChapterTenTitle ={ desc:'十、【其他】',fontFamily:'Medium'} ;
        var ChapterTen10_1_desc ={ desc:'10.1 爱邻购有权在必要时变更本协议条款，您可以在爱邻购的相关页面查阅最新版本的协议条款。本' +
        '协议条款变更后，如果您继续使用爱邻购服务，即视为您已接受变更后的协议。',fontFamily:'Medium'} ;



        var ChapterTenArr = [ChapterTenTitle,ChapterTen10_1_desc]
        this.state.UserAgreementDataArr.push(ChapterTenArr)

        //公司落款
        var companyTitle ={ desc:'ILINKGO PTE. LTD.',fontFamily:'Medium'} ;




        var companyTitleArr = [companyTitle]
        this.state.UserAgreementDataArr.push(companyTitleArr)

    }
    _logout_function(){

        //logout here
        this._removeStorage();
        //logout success go 2 call page
        // var routes = this.props.navigator.state.routeStack;
        // for (var i = routes.length - 1; i >= 0; i--) {
        //     if(routes[i].name === "MyDestinationRoute"){
        //     var destinationRoute = this.props.navigator.getCurrentRoutes()[i]
        //     this.props.navigator.popToRoute(destinationRoute);
        //
        //     }
        // }
        this.props.navigator.resetTo({
            component: Welcome,
            name: 'Welcome'
        })
    };
    async _removeStorage() {
        Global.UserInfo = null;
        AsyncStorage.removeItem('k_login_info').then((value) => {

            }
        ).done();

    }
    userAgreement(){
        let param = {
            update:{
                agree_ua:1
            }
        }
        console.log('agree_ua:'+JSON.stringify(param))
        HttpRequest.post('/v2','/api.user.profile.update', param, this.onGetProfileSuccess.bind(this),
            (e) => {
                console.log(' error:' + e);
                // Alert.alert('提示','获取商品类别失败，请稍后再试。')
            })
    }
    onGetProfileSuccess(response){
        console.log('agree_ua12:'+JSON.stringify(response))

        Global.agree_ua = 1;
        this.props.navigator.replace({
            component: NewProductCategoryView,
            props: {
                hasSet:false,
                oldSet:null,
                isUserAgentmentTo:true

            }
        })

        // Alert.alert(
        //     '提示',
        //     '您已同意爱邻购用户协议，请发布你想要上传的商品',
        //     [
        //
        //
        //         {text: '确定', onPress: this.onToNewProduct.bind(this)},
        //     ],
        //     { cancelable: false }
        // )

    }
    onToNewProduct(){

    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="爱邻购用户协议"
                    titleStyle={{fontSize:17,color:'rgb(3,3,3)',fontFamily:'PingFangSC-Semibold',textAlign:'center'}}
                    leftTitle={'关闭'}
                    leftTitleStyle={{fontSize:17,color:'rgb(3,3,3)',fontFamily:'PingFangSC-Regular',textAlign:'left'}}
                    leftPress={this.back.bind(this)}
                    rightTitle={'同意'}
                    rightTitleStyle={{fontSize:17,color:'rgb(0,122,255)',fontFamily:'PingFangSC-Regular',textAlign:'right'}}
                    rightPress={this.userAgreement.bind(this)}

            />

                <View >
                    <ScrollView keyboardDismissMode='on-drag'
                                keyboardShouldPersistTaps={false}
                                style={{margin:15}}
                                contentContainerStyle={{paddingBottom:80}}



                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}



                    >
                        {this.renderUserAgreementView(this.state.UserAgreementDataArr)}
                    </ScrollView>


                </View>


            </View>
        )
    }
    renderUserAgreementView(renderUserAgreementArr){
        var displayUserAgreementArr = []
        for (var i = 0; i < renderUserAgreementArr.length; i++){
                var chapterItemArr = renderUserAgreementArr[i];
                displayUserAgreementArr.push(
                    <View>
                        {this.renderChapterItemView(chapterItemArr,i)}
                    </View>
                )

        }
        return displayUserAgreementArr;

    }
    renderChapterItemView(chapterItemArr,num){

        var displayChapterItemArr = []
        for (var i = 0; i < chapterItemArr.length; i++){
            var ItemDic = chapterItemArr[i];
            displayChapterItemArr.push(
                <View>
                    {this.renderChapterText(ItemDic,i)}
                </View>
            )

        }
        return displayChapterItemArr;
    }
    renderChapterText(textItemDic,index){
        let content = textItemDic.desc
        if (Platform.OS === 'android' ){
            if (textItemDic.desc == 'ILINKGO PTE. LTD.'){
                return( <Text style={{marginTop:40,fontSize:14,color:'rgb(3,3,3)',fontFamily:'PingFangSC-Medium',textAlign:'right',lineHeight:20,borderWidth:'bold'}}>{content}</Text>)
            }else if(textItemDic.fontFamily == 'Medium'){
                return( <Text style={{marginTop:10,fontSize:14,color:'rgb(3,3,3)',fontFamily:'PingFangSC-Medium',textAlign:'left',lineHeight:20,borderWidth:'bold'}}>{content}</Text>)
            }else if(textItemDic.fontFamily == 'Regular'){
                return( <Text style={{marginTop:10,fontSize:14,color:'rgb(3,3,3)',fontFamily:'PingFangSC-Regular',textAlign:'left',lineHeight:20}}>{content}</Text>)
            }else {

            }
        }else {
            if (textItemDic.desc == 'ILINKGO PTE. LTD.'){
                return( <Text style={{marginTop:40,fontSize:14,color:'rgb(3,3,3)',fontFamily:'PingFangSC-Medium',textAlign:'right',lineHeight:20}}>{content}</Text>)
            }else if(textItemDic.fontFamily == 'Medium'){
                return( <Text style={{marginTop:10,fontSize:14,color:'rgb(3,3,3)',fontFamily:'PingFangSC-Medium',textAlign:'left',lineHeight:20}}>{content}</Text>)
            }else if(textItemDic.fontFamily == 'Regular'){
                return( <Text style={{marginTop:10,fontSize:14,color:'rgb(3,3,3)',fontFamily:'PingFangSC-Regular',textAlign:'left',lineHeight:20}}>{content}</Text>)
            }else {

            }
        }



    }


}


const styles = StyleSheet.create({

    btnLogout: {
        marginTop: 30,
        height: 50,
        width: width - 20,
        backgroundColor: '#d40000',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutText: {
        color: '#ffffff',
        fontSize: 18,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    defaultText: {
        color:'#1c1c1c',
        fontSize: 16,
        fontFamily:'PingFangSC-Light',
        textAlign:'center',
        width:width-50,
    },
    itemView:
        {
            alignSelf: 'stretch',
            // justifyContent: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 50,
            width: width,
            borderColor: 'gray',
            borderWidth: 0.5,
            flexDirection: 'row',
            backgroundColor: 'white'
        }
})
