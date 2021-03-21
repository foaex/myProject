<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png"
             alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form class="login_form"
               :model="LoginForm"
               :rules="LoginFormRules"
               ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user"
                    v-model="LoginForm.username"
                    ref="loginUserName"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima"
                    type="password"
                    v-model="LoginForm.password"
                    ref="loginPassword"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary"
                     @click="login">登录</el-button>
          <el-button type="info"
                     @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { request } from '../request/request'
export default {
  name: 'Login',
  data () {
    return {
      LoginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      LoginFormRules: {
        // 验证用户名是否合法
        username: [{ required: true, message: '请输入登录名称', trigger: 'blur' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        // 验证密码是否符合要求
        password: [{ required: true, message: '用户名或密码错误', trigger: 'blur' }, { min: 6, max: 18, message: '至少6位并且包含字母和数字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFromRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) return
        const username = this.$refs.loginUserName.value
        const psd = this.$refs.loginPassword.value
        request({
          url: '/login',
          type: 'post',
          params: {
            username: username,
            password: psd
          }
        }).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('登录失败')
          }
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        })
      })
    }
  }
}
</script>
<style scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
