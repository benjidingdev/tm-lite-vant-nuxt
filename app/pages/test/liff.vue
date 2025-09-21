<script setup lang="ts">
const {
  endpointUrl,
  isLoginIn,
  profile,
  login,
  logout,
  getAccessToken,
  getIDToken,
  getDecodedIDToken,
  getGrantedAllScopes,
  requestAll,
  sendMessages,
  shareTargetPicker,
  createUrlBy
} = $(liffStore());

const { t } = useI18n();
const origin = ref<string | null>(null)
const isMultiple = ref(true)
const textMessage = reactive({
  type: 'text',
  text: 'Hello World',
})
const textMessage2 = reactive({
  type: 'text',
  text: 'Welcome, {user1}! {laugh}\n{everyone} There is a newcomer!',
  substitution: {
    user1: {
      type: 'mention',
      mentionee: {
        type: 'user',
        userId: profile?.userId || '',
      },
    },
    laugh: {
      type: 'emoji',
      productId: '5a8555cfe6256cc92ea23c2a',
      emojiId: '002',
    },
    everyone: {
      type: 'mention',
      mentionee: {
        type: 'all',
      },
    },
  },
})
const imageMessage = reactive({
  type: 'image',
  originalContentUrl: computed(() => encodeURIComponent(`${origin.value}/media/twitter-card.png`)),
  previewImageUrl: computed(() => encodeURIComponent(`${origin.value}/media/twitter-card.png`)),
})
const templateMessage = reactive({
  type: 'template',
  altText: "This is a buttons template",
  template: {
    type: "buttons",
    thumbnailImageUrl: computed(() => encodeURIComponent(`${origin.value}/media/twitter-card.png`)),
    imageAspectRatio: "rectangle",
    imageSize: "cover",
    imageBackgroundColor: "#FFFFFF",
    title: "Menu",
    text: "Please select",
    defaultAction: {
      type: "uri",
      label: "View detail",
      uri: computed(() => encodeURIComponent(`${origin.value}/invite`)),
    },
    actions: [
      {
        type: "postback",
        label: "Buy",
        data: "action=buy&itemid=123"
      },
      {
        type: "postback",
        label: "Invite",
        data: "action=invite&itemid=123"
      },
      {
        type: "uri",
        label: "View detail",
        uri: computed(() => encodeURIComponent(`${origin.value}/invite`))
      }
    ]
  }
})

const accessToken = ref()
const testGetAccessToken = async () => {
  accessToken.value = getAccessToken()
}

const idToken = ref()
const testGetIDToken = async () => {
  idToken.value = getIDToken()
}

const decodedIDToken = ref()
const testGetDecodedIDToken = async () => {
  decodedIDToken.value = getDecodedIDToken()
}

const grantedAllScopes = ref()
const testGetGrantedAllScopes = async () => {
  grantedAllScopes.value = await getGrantedAllScopes()
}

const testRequestAllScopes = async () => {
  await requestAll()
}

const createdUrl = ref()
const createUrlByTest = async () => {
  createdUrl.value = await createUrlBy(`${endpointUrl}/invite?userId=${profile?.userId}`)
}

// https://frp.jdoffices.com/?code=RkHYG1gKJYvE2ynvTmBh&state=eofJLAsg3vjR&liffClientId=2008136886&liffRedirectUri=https%3A%2F%2Ffrp.jdoffices.com%2F
// https://access.line.me/oauth2/v2.1/login?returnUri=%2Foauth2%2Fv2.1%2Fauthorize%2Fconsent%3Fapp_id%3D2008136886-Nke5LwLP%26client_id%3D2008136886%26scope%3Dchat_message.write%2520openid%2520profile%26state%3DL7BV9wWsw7dH%26response_type%3Dcode%26code_challenge_method%3DS256%26code_challenge%3DAF-WNHwX4S7U-HRVuq9bNc6v_23vCFcOGYsHl-w9QNM%26liff_sdk_version%3D2.27.2%26type%3DL%26redirect_uri%3Dhttps%253A%252F%252Ffrp.jdoffices.com%252F&loginChannelId=2008136886&loginState=Y5zmOzg00NASvnjmDO9QFw&fromDomain=access-auto.line.me&line_auto_login_error=universal_link_error

onMounted(() => {
  origin.value = useRequestURL().origin
})
</script>
<template>
  <div class="h-screen pb-15 !text-[#fff] overflow-y-auto" style="padding-bottom: 150px;">
    <van-form>
      <van-cell-group inset :title="t('LIFF Test')">
        <van-cell is-link :title="isLoginIn ? t('Login out') : t('Login in')"
          @click="isLoginIn ? logout() : login('/test/liff')" />
        <van-cell is-link :title="t('Get AccessToken')" @click="testGetAccessToken" :label="accessToken" />
        <van-cell is-link :title="t('Get IDToken')" @click="testGetIDToken" :label="idToken" />
        <van-cell is-link :title="t('Get DecodedIDToken')" @click="testGetDecodedIDToken" :label="decodedIDToken" />
        <van-cell is-link :title="t('Get All Permissions')" @click="testGetGrantedAllScopes"
          :label="grantedAllScopes" />
        <van-cell is-link :title="t('Request All Permissions')" @click="testRequestAllScopes" />
      </van-cell-group>
      <van-cell-group inset :title="t('LIFF User Operation')">
        <van-cell is-link :title="t('Profile')" :label="JSON.stringify(profile)" />
        <van-cell is-link :title="t('Permanent Share Link')" @click="createUrlByTest" :label="createdUrl" />
      </van-cell-group>
      <van-cell-group inset :title="t('Text Message')">
        <van-field v-model="textMessage.type" name="type" :label="t('Message Type')" />
        <van-field v-model="textMessage.text" name="text" :label="t('Text Content')" />
        <van-cell center :title="t('Is Multiple')">
          <template #right-icon>
            <van-switch v-model="isMultiple" />
          </template>
        </van-cell>
        <div class="my-5 flex flex-row justify-center gap-4">
          <van-button square size="small" type="primary" @click="sendMessages([textMessage])">
            {{ t('Send in Current Channel') }}
          </van-button>
          <van-button square size="small" type="primary" @click="shareTargetPicker([textMessage], isMultiple)">
            {{ t('Send in Selected Targets') }}
          </van-button>
        </div>
      </van-cell-group>
      <van-cell-group inset :title="t('SMS Message')">
        <van-field v-model="textMessage2.type" name="type" :label="t('Message Type')" />
        <van-field v-model="textMessage2.text" name="text" :label="t('Text Content')" />
        <van-field :model-value="JSON.stringify(textMessage2.substitution)" name="substitution"
          :label="t('Substitution Text')" />
        <van-cell center :title="t('Is Multiple')">
          <template #right-icon>
            <van-switch v-model="isMultiple" />
          </template>
        </van-cell>
        <div class="my-5 flex flex-row justify-center gap-4">
          <van-button square size="small" type="primary" @click="sendMessages([textMessage2])">
            {{ t('Send in Current Channel') }}
          </van-button>
          <van-button square size="small" type="primary" @click="shareTargetPicker([textMessage2], isMultiple)">
            {{ t('Send in Selected Targets') }}
          </van-button>
        </div>
      </van-cell-group>
      <van-cell-group inset :title="t('Image Message')">
        <van-field v-model="imageMessage.type" name="type" :label="t('Message Type')" />
        <van-field v-model="imageMessage.originalContentUrl" name="originalContentUrl" :label="t('Image URL')" />
        <van-field v-model="imageMessage.previewImageUrl" name="previewImageUrl" :label="t('Preview Image URL')" />
        <van-cell center :title="t('Is Multiple')">
          <template #right-icon>
            <van-switch v-model="isMultiple" />
          </template>
        </van-cell>
        <div class="my-5 flex flex-row justify-center gap-4">
          <van-button square size="small" type="primary" @click="sendMessages([imageMessage])">
            {{ t('Send in Current Channel') }}
          </van-button>
          <van-button square size="small" type="primary" @click="shareTargetPicker([imageMessage], isMultiple)">
            {{ t('Send in Selected Targets') }}
          </van-button>
        </div>
      </van-cell-group>
      <van-cell-group inset :title="t('Template Message')">
        <van-field v-model="templateMessage.type" name="type" :label="t('Message Type')" />
        <van-field v-model="templateMessage.altText" name="altText" :label="t('Substitution Text')" />
        <van-field :model-value="JSON.stringify(templateMessage.template)" name="template"
          :label="t('Template Content')" />
        <van-cell center :title="t('Is Multiple')">
          <template #right-icon>
            <van-switch v-model="isMultiple" />
          </template>
        </van-cell>
        <div class="my-5 flex flex-row justify-center gap-4">
          <van-button square size="small" type="primary" @click="sendMessages([templateMessage])">
            {{ t('Send in Current Channel') }}
          </van-button>
          <van-button square size="small" type="primary" @click="shareTargetPicker([templateMessage], isMultiple)">
            {{ t('Send in Selected Targets') }}
          </van-button>
        </div>
      </van-cell-group>
    </van-form>
  </div>
</template>
<style scoped>
:deep(.van-cell-group__title) {
  color: white
}
</style>
<i18n lang="json">{
  "en-US": {
    "LIFF Test": "LIFF Test",
    "Login in": "Login in",
    "Login out": "Login out",
    "Get AccessToken": "Get AccessToken",
    "Get IDToken": "Get IDToken",
    "Get DecodedIDToken": "Get DecodedIDToken",
    "Get All Permissions": "Get All Permissions",
    "Request All Permissions": "Request All Permissions",
    "LIFF User Operation": "LIFF User Operation",
    "Profile": "Profile",
    "Permanent Share Link": "Permanent Share Link",
    "Text Message": "Text Message",
    "Message Type": "Message Type",
    "Text Content": "Text Content",
    "SMS Message": "SMS Message",
    "Substitution Text": "Substitution Text",
    "Image Message": "Image Message",
    "Image URL": "Image URL",
    "Preview Image URL": "Preview Image URL",
    "Template Message": "Template Message",
    "Template Content": "Template Content",
    "Is Multiple": "Is Multiple",
    "Send in Current Channel": "Send in Current Channel",
    "Send in Selected Targets": "Send in Selected Targets"
  },
  "zh-TW": {
    "LIFF Test": "LIFF測試",
    "Login in": "登入",
    "Login out": "登出",
    "Get AccessToken": "獲取accessToken",
    "Get IDToken": "獲取IDToken",
    "Get DecodedIDToken": "獲取DecodedIDToken",
    "Get All Permissions": "獲取全部許可權",
    "Request All Permissions": "請求全部許可權",
    "LIFF User Operation": "LIFF用戶操作",
    "Profile": "用戶資訊",
    "Permanent Share Link": "永久分享連結",
    "Text Message": "文字消息",
    "Message Type": "消息類型",
    "Text Content": "文字內容",
    "SMS Message": "簡訊消息",
    "Substitution Text": "替代文字",
    "Image Message": "圖片消息",
    "Image URL": "圖片URL",
    "Preview Image URL": "預覽圖片URL",
    "Template Message": "範本消息",
    "Template Content": "範本內容",
    "Is Multiple": "是否群發",
    "Send in Current Channel": "在當前頻道中發送消息",
    "Send in Selected Targets": "在選擇對象中發送消息"
  },
  "ja-JP": {
    "LIFF Test": "LIFFテスト",
    "Login in": "ログイン",
    "Login out": "ログアウト",
    "Get AccessToken": "accessTokenを取得",
    "Get IDToken": "IDTokenを取得",
    "Get DecodedIDToken": "DecodedIDTokenを取得",
    "Get All Permissions": "すべての権限を取得",
    "Request All Permissions": "すべての権限をリクエスト",
    "LIFF User Operation": "LIFFユーザー操作",
    "Profile": "ユーザー情報",
    "Permanent Share Link": "永久共有リンク",
    "Text Message": "テキストメッセージ",
    "Message Type": "メッセージタイプ",
    "Text Content": "テキスト内容",
    "SMS Message": "SMSメッセージ",
    "Substitution Text": "代替テキスト",
    "Image Message": "画像メッセージ",
    "Image URL": "画像URL",
    "Preview Image URL": "プレビュー画像URL",
    "Template Message": "テンプレートメッセージ",
    "Template Content": "テンプレート内容",
    "Is Multiple": "一斉送信するか",
    "Send in Current Channel": "現在のチャンネルで送信",
    "Send in Selected Targets": "選択した対象に送信"
  },
  "ko-KR": {
    "LIFF Test": "LIFF 테스트",
    "Login in": "로그인",
    "Login out": "로그아웃",
    "Get AccessToken": "accessToken 가져오기",
    "Get IDToken": "IDToken 가져오기",
    "Get DecodedIDToken": "DecodedIDToken 가져오기",
    "Get All Permissions": "모든 권한 가져오기",
    "Request All Permissions": "모든 권한 요청",
    "LIFF User Operation": "LIFF 사용자 작업",
    "Profile": "사용자 정보",
    "Permanent Share Link": "영구 공유 링크",
    "Text Message": "텍스트 메시지",
    "Message Type": "메시지 유형",
    "Text Content": "텍스트 내용",
    "SMS Message": "SMS 메시지",
    "Substitution Text": "대체 텍스트",
    "Image Message": "이미지 메시지",
    "Image URL": "이미지 URL",
    "Preview Image URL": "미리보기 이미지 URL",
    "Template Message": "템플릿 메시지",
    "Template Content": "템플릿 내용",
    "Is Multiple": "일괄 발송 여부",
    "Send in Current Channel": "현재 채널에서 보내기",
    "Send in Selected Targets": "선택한 대상에게 보내기"
  }
}</i18n>
