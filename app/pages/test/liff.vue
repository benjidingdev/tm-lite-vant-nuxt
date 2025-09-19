<script setup lang="ts">
const { isLoginIn, profile, login, logout, getAccessToken, getIDToken, getDecodedIDToken, getGrantedAllScopes, sendMessages, shareTargetPicker } = $(liffStore());

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
  originalContentUrl: encodeURIComponent(`${origin.value}/logo.png`),
  previewImageUrl: encodeURIComponent(`${origin.value}/logo.png`),
})
const templateMessage = reactive(
  {
    type: 'template',
    altText: "This is a buttons template",
    template: {
      type: "buttons",
      thumbnailImageUrl: encodeURIComponent(`${origin.value}/media/twitter-card.png`),
      imageAspectRatio: "rectangle",
      imageSize: "cover",
      imageBackgroundColor: "#FFFFFF",
      title: "Menu",
      text: "Please select",
      defaultAction: {
        type: "uri",
        label: "View detail",
        uri: encodeURIComponent(`${origin.value}/invite`),
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
          uri: encodeURIComponent(`${origin.value}/invite`)
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

// https://frp.jdoffices.com/?code=RkHYG1gKJYvE2ynvTmBh&state=eofJLAsg3vjR&liffClientId=2008136886&liffRedirectUri=https%3A%2F%2Ffrp.jdoffices.com%2F
// https://access.line.me/oauth2/v2.1/login?returnUri=%2Foauth2%2Fv2.1%2Fauthorize%2Fconsent%3Fapp_id%3D2008136886-Nke5LwLP%26client_id%3D2008136886%26scope%3Dchat_message.write%2520openid%2520profile%26state%3DL7BV9wWsw7dH%26response_type%3Dcode%26code_challenge_method%3DS256%26code_challenge%3DAF-WNHwX4S7U-HRVuq9bNc6v_23vCFcOGYsHl-w9QNM%26liff_sdk_version%3D2.27.2%26type%3DL%26redirect_uri%3Dhttps%253A%252F%252Ffrp.jdoffices.com%252F&loginChannelId=2008136886&loginState=Y5zmOzg00NASvnjmDO9QFw&fromDomain=access-auto.line.me&line_auto_login_error=universal_link_error

onMounted(() => {
  origin.value = useRequestURL().origin
})
</script>
<template>
  <div class="h-screen pb-15 !text-[#fff] overflow-y-auto" style="padding-bottom: 150px;">
    <van-form>
      <van-cell-group inset title="LIFF测试" class="text-[#fff]">
        <van-cell is-link :title="isLoginIn ? '登出' : '登录'" @click="isLoginIn ? logout() : login()" />
        <van-cell is-link title="获取accessToken" @click="testGetAccessToken" :label="accessToken" />
        <van-cell is-link title="获取IDToken" @click="testGetIDToken" :label="idToken" />
        <van-cell is-link title="获取DecodedIDToken" @click="testGetDecodedIDToken" :label="decodedIDToken" />
        <van-cell is-link title="获取全部权限" @click="testGetGrantedAllScopes" :label="grantedAllScopes" />
      </van-cell-group>
      <van-cell-group inset title="LIFF用户操作" class="text-[#fff]">
        <van-cell is-link title="profile" :label="JSON.stringify(profile)" />
      </van-cell-group>
      <van-cell-group inset title="文本消息">
        <van-field v-model="textMessage.type" name="type" label="消息类型" />
        <van-field v-model="textMessage.text" name="text" label="文本内容" />
        <van-cell center title="是否群发">
          <template #right-icon>
            <van-switch v-model="isMultiple" />
          </template>
        </van-cell>
        <div class="my-5 flex flex-row justify-center gap-4">
          <van-button square size="small" type="primary" @click="sendMessages([textMessage])">
            在当前频道中发送消息
          </van-button>
          <van-button square size="small" type="primary" @click="shareTargetPicker([textMessage], isMultiple)">
            在选择对象中发送消息
          </van-button>
        </div>
      </van-cell-group>
      <van-cell-group inset title="短信消息">
        <van-field v-model="textMessage2.type" name="type" label="消息类型" />
        <van-field v-model="textMessage2.text" name="text" label="文本内容" />
        <van-field :value="JSON.stringify(textMessage2.substitution)" name="text" label="文本内容" />
        <van-cell center title="是否群发">
          <template #right-icon>
            <van-switch v-model="isMultiple" />
          </template>
        </van-cell>
        <div class="my-5 flex flex-row justify-center gap-4">
          <van-button square size="small" type="primary" @click="sendMessages([textMessage2])">
            在当前频道中发送消息
          </van-button>
          <van-button square size="small" type="primary" @click="shareTargetPicker([textMessage2], isMultiple)">
            在选择对象中发送消息
          </van-button>
        </div>
      </van-cell-group>
      <van-cell-group inset title="图片消息">
        <van-field v-model="imageMessage.type" name="type" label="消息类型" />
        <van-field v-model="imageMessage.originalContentUrl" name="originalContentUrl" label="图片URL" />
        <van-field v-model="imageMessage.previewImageUrl" name="previewImageUrl" label="预览图片URL" />
        <van-cell center title="是否群发">
          <template #right-icon>
            <van-switch v-model="isMultiple" />
          </template>
        </van-cell>
        <div class="my-5 flex flex-row justify-center gap-4">
          <van-button square size="small" type="primary" @click="sendMessages([imageMessage])">
            在当前频道中发送消息
          </van-button>
          <van-button square size="small" type="primary" @click="shareTargetPicker([imageMessage], isMultiple)">
            在选择对象中发送消息
          </van-button>
        </div>
      </van-cell-group>
      <van-cell-group inset title="模板消息">
        <van-field v-model="templateMessage.type" name="type" label="消息类型" />
        <van-field v-model="templateMessage.altText" name="altText" label="替代文本" />
        <van-field :value="JSON.stringify(templateMessage.template)" name="template" label="模板内容" />
        <van-cell center title="是否群发">
          <template #right-icon>
            <van-switch v-model="isMultiple" />
          </template>
        </van-cell>
        <div class="my-5 flex flex-row justify-center gap-4">
          <van-button square size="small" type="primary" @click="sendMessages([templateMessage])">
            在当前频道中发送消息
          </van-button>
          <van-button square size="small" type="primary" @click="shareTargetPicker([templateMessage], isMultiple)">
            在选择对象中发送消息
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
