# 依赖与公开上游清单

本清单随构建自动生成，来源为package.json、pnpm-lock.yaml、源码外部模块引用和scripts/build-update-catalog.mjs中的上游资源定义。不是对宿主已安装程序的检查。当前插件：dsh-qq-gateway 2.6.1。

| 项目 | 类别 | 声明/公开快照基准（非安装证明） | 检查来源 | 用途 |
| --- | --- | --- | --- | --- |
| @deepseek-ai/cordis | host-sdk | 4.0.5 | npm: @deepseek-ai/cordis | 插件调用的宿主SDK接口，随dsh预览版本校验兼容 |
| @deepseek-ai/cosmokit | transitive-package | 1.8.6 | npm: @deepseek-ai/cosmokit | 锁文件间接依赖，核对引入它的上层包后再更新 |
| @deepseek-ai/schemastery | host-sdk | 3.18.5 | npm: @deepseek-ai/schemastery | 插件调用的宿主SDK接口，随dsh预览版本校验兼容 |
| @standard-schema/spec | transitive-package | 1.1.0 | npm: @standard-schema/spec | 锁文件间接依赖，核对引入它的上层包后再更新 |
| @types/node | development-package | 24.19.2 | npm: @types/node | 插件运行或构建/测试依赖；合并管理1项内部记录，详细归属见清单JSON，不逐项检查或提醒 |
| @types/nodemailer | development-package | 8.0.2 | npm: @types/nodemailer | 插件运行或构建/测试依赖 |
| @types/semver | development-package | 7.7.1 | npm: @types/semver | 插件运行或构建/测试依赖 |
| @types/ws | development-package | 8.18.2 | npm: @types/ws | 插件运行或构建/测试依赖 |
| acorn | development-package | 8.19.0 | npm: acorn | 插件运行或构建/测试依赖 |
| nodemailer | runtime-package | 10.2.1 | npm: nodemailer | 插件运行或构建/测试依赖 |
| playwright | development-package | 1.64.1 | npm: playwright | 插件运行或构建/测试依赖；合并管理2项内部记录，详细归属见清单JSON，不逐项检查或提醒 |
| semver | runtime-package | 7.8.5 | npm: semver | 插件运行或构建/测试依赖 |
| typescript | development-package | 7.0.2 | npm: typescript | 插件运行或构建/测试依赖；合并管理20项内部记录，详细归属见清单JSON，不逐项检查或提醒 |
| ws | runtime-package | 8.22.0 | npm: ws | 插件运行或构建/测试依赖 |
| yaml | runtime-package | 2.9.1 | npm: yaml | 插件运行或构建/测试依赖 |
| dsh-qq-gateway正式发行 | upstream | 2.6.1 | github: Geng-zy/dsh-qq-gateway | 本插件公开正式发行；不自动下载安装 |
| 人格记忆插件可选联动 | upstream | 2.6.1 | github: Geng-zy/dsh-persona-memory | 可选插件间事件与服务接口兼容；独立安装不要求另一个插件在场 |
| DeepSeek Harness | upstream | 0.2.1-rc.2 | npm: @deepseek-ai/dsh | 宿主公开发行与插件SDK兼容，允许预览版；不扫描宿主安装情况；合并管理31项内部记录，详细归属见清单JSON，不逐项检查或提醒 |
| Node.js LTS | upstream | 24.22.1 | node-lts: https://nodejs.org/dist/index.json | 插件运行/开发所需的上游最新LTS；不检测服务器安装；合并管理8项内部记录，详细归属见清单JSON，不逐项检查或提醒 |
| Jina Reader公开网页读取后备 | service | 首次公开观测建立基准，非已适配证明 | document: https://jina.ai/reader/ | 可选公开文档读取后备服务；仅发送公开来源URL，不发送凭据、配置或业务数据 |
| pnpm | upstream | 11.28.5 | npm: pnpm | 仓库安装、锁文件及发布工具 |
| GNU tar归档工具 | external-tool-reference | 首次公开观测建立基准，非已适配证明 | document: https://www.gnu.org/software/tar/ | 仅跟踪插件相关工具的公开版本/发布资料，不检查或修改宿主安装；首次观测不是已适配基准 |
| gzip压缩格式/归档工具 | external-tool-reference | 首次公开观测建立基准，非已适配证明 | document: https://www.gnu.org/software/gzip/ | 仅跟踪插件相关工具的公开版本/发布资料，不检查或修改宿主安装；首次观测不是已适配基准 |
| Python安装/开发工具 | external-tool-reference | 首次公开观测建立基准，非已适配证明 | document: https://www.python.org/downloads/ | 仅跟踪插件相关工具的公开版本/发布资料，不检查或修改宿主安装；首次观测不是已适配基准 |
| Git源码/发布工具 | external-tool-reference | 首次公开观测建立基准，非已适配证明 | document: https://git-scm.com/downloads | 仅跟踪插件相关工具的公开版本/发布资料，不检查或修改宿主安装；首次观测不是已适配基准 |
| curl下载引导工具 | external-tool-reference | 首次公开观测建立基准，非已适配证明 | document: https://curl.se/changes.html | 仅跟踪插件相关工具的公开版本/发布资料，不检查或修改宿主安装；首次观测不是已适配基准 |
| Bash脚本工具 | external-tool-reference | 首次公开观测建立基准，非已适配证明 | document: https://www.gnu.org/software/bash/ | 仅跟踪插件相关工具的公开版本/发布资料，不检查或修改宿主安装；首次观测不是已适配基准 |
| libarchive/bsdtar可选归档实现 | external-tool-reference | 首次公开观测建立基准，非已适配证明 | github: libarchive/libarchive | macOS等环境的tar实现兼容参考；不检查本机版本 |
| SnowLuma | upstream | v2.2.1 | github: SnowLuma/SnowLuma | QQ/OneBot上游正式发行与事件/API兼容；合并管理600项内部记录，详细归属见清单JSON，不逐项检查或提醒 |
| AstrBot移植来源 | upstream | v4.29.1 | github: AstrBotDevs/AstrBot | 移植消息转换、唤醒、引用和响应规则；逐文件比较，不整包替换 |
| aiocqhttp移植来源 | upstream | 1.4.4 | pypi: aiocqhttp | OneBot反向WS、事件总线与API结果匹配的移植来源 |
| QQ小黄脸编号/名称 | resource | 20ab855 | github-file: koishijs/QFace / public/assets/qq_emoji/_index.v2.json | QFace数字表情数据，不含图片；更新后复核旧编号兼容和MIT署名 |
| Server酱官方SDK/协议说明 | upstream | 首次公开观测建立基准，非已适配证明 | github-file: easychen/serverchan-sdk / README.md | 官方SMTP之外的微信推送协议、SendKey格式及接口路径变化，不作为运行SDK安装 |
| QFace旧版数据包 | upstream | 1.4.1 | npm: qface | 旧表情编号补全来源；上游新版需要审查数据格式，不自动替换 |
| FFmpeg正式发行 | upstream | 9.0.0 | ffmpeg-release: https://ffmpeg.org/download.html | 视频抽帧和插件可选下载器所用媒体工具；只查上游不运行本机命令 |
| FFmpeg预编译构建说明 | upstream | 首次公开观测建立基准，非已适配证明 | document: https://github.com/BtbN/FFmpeg-Builds | 正式分支下载资产、平台命名及校验规则；资料变化需核实，不能把滚动构建当稳定发版 |
| DeepSeek对话模型/接口 | service | 首次公开观测建立基准，非已适配证明 | document: https://api-docs.deepseek.com/updates/ | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| OneBot 11协议 | service | 首次公开观测建立基准，非已适配证明 | document: https://raw.githubusercontent.com/botuniverse/onebot-11/master/README.md | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| BreezeBlue TTS | service | 首次公开观测建立基准，非已适配证明 | document: https://docs.breezeblue.ai/ | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| Inworld TTS | service | 首次公开观测建立基准，非已适配证明 | document: https://docs.inworld.ai/docs/tts/tts | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| OpenAI接口/生图/语音识别 | service | 首次公开观测建立基准，非已适配证明 | document: https://developers.openai.com/api/docs/deprecations | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| Azure OpenAI接口 | service | 首次公开观测建立基准，非已适配证明 | document: https://learn.microsoft.com/en-us/azure/ai-services/openai/api-version-deprecation | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| 魔搭推理服务 | service | 首次公开观测建立基准，非已适配证明 | document: https://modelscope.cn/docs/model-service/API-Inference/intro | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| 百炼图像服务 | service | 首次公开观测建立基准，非已适配证明 | document: https://help.aliyun.com/zh/model-studio/text-to-image | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| Gemini/Imagen API | service | 首次公开观测建立基准，非已适配证明 | document: https://ai.google.dev/gemini-api/docs/changelog | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| Vertex AI图像服务 | service | 首次公开观测建立基准，非已适配证明 | document: https://cloud.google.com/vertex-ai/generative-ai/docs/release-notes | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| OpenRouter | service | 首次公开观测建立基准，非已适配证明 | document: https://openrouter.ai/docs/changelog | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| Black Forest Labs | service | 首次公开观测建立基准，非已适配证明 | document: https://docs.bfl.ai | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| fal.ai | service | 首次公开观测建立基准，非已适配证明 | document: https://docs.fal.ai | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| Replicate | service | 首次公开观测建立基准，非已适配证明 | document: https://replicate.com/changelog | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| Stability AI | service | 首次公开观测建立基准，非已适配证明 | document: https://platform.stability.ai/docs/release-notes | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| Ideogram | service | 首次公开观测建立基准，非已适配证明 | document: https://developer.ideogram.ai | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| Hugging Face推理 | service | 首次公开观测建立基准，非已适配证明 | document: https://huggingface.co/docs/inference-providers/index | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| Server酱 | service | 首次公开观测建立基准，非已适配证明 | document: https://sct.ftqq.com/docs/ | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| PushPlus | service | 首次公开观测建立基准，非已适配证明 | document: https://www.pushplus.plus/doc/guide/api.html | 官方接口/模型发布与弃用资料变化；全量监测支持项，不代表已配置或实际启用 |
| AUTOMATIC1111 | upstream | 首次公开观测建立基准，非已适配证明 | github: AUTOMATIC1111/stable-diffusion-webui | 可选接入上游，首次仅发现正式版本，基准需按适配实际补充；不探测本机程序 |
| Forge | upstream | 首次公开观测建立基准，非已适配证明 | github: lllyasviel/stable-diffusion-webui-forge | 可选接入上游，首次仅发现正式版本，基准需按适配实际补充；不探测本机程序 |
| ComfyUI | upstream | 首次公开观测建立基准，非已适配证明 | github: Comfy-Org/ComfyUI | 可选接入上游，首次仅发现正式版本，基准需按适配实际补充；不探测本机程序 |
| Diffusers本地命令接入 | upstream | 首次公开观测建立基准，非已适配证明 | github: huggingface/diffusers | 可选接入上游，首次仅发现正式版本，基准需按适配实际补充；不探测本机程序 |
| Anthropic报告API | service | 首次公开观测建立基准，非已适配证明 | document: https://platform.claude.com/docs/en/release-notes/api | 独立报告模型模板的公开接口与弃用说明 |
| 硅基流动报告API | service | 首次公开观测建立基准，非已适配证明 | document: https://docs.siliconflow.cn/cn/release-notes/overview | 独立报告模型模板的公开接口与弃用说明 |
| Mistral | related-project | 首次公开观测建立基准，非已适配证明 | document: https://docs.mistral.ai/getting-started/changelog/ | 内置聊天/向量/语音识别/通知模板相关的官方接口、模型和弃用资料；不代表用户已启用 |
| Groq | related-project | 首次公开观测建立基准，非已适配证明 | document: https://console.groq.com/docs/changelog | 内置聊天/向量/语音识别/通知模板相关的官方接口、模型和弃用资料；不代表用户已启用 |
| 智谱 | related-project | 首次公开观测建立基准，非已适配证明 | document: https://docs.bigmodel.cn/cn/guide/start/model-overview | 内置聊天/向量/语音识别/通知模板相关的官方接口、模型和弃用资料；不代表用户已启用 |
| Ollama | related-project | 首次公开观测建立基准，非已适配证明 | github: ollama/ollama | 可选OpenAI兼容本地模型服务，不读取本机模型和安装版本 |
| LM Studio | related-project | 首次公开观测建立基准，非已适配证明 | document: https://lmstudio.ai/changelog | 可选本地OpenAI兼容服务的官方稳定版发布记录 |
| LobeHub服务商图标 | resource | 1.98.0 | npm: @lobehub/icons-static-svg | 静态内嵌Logo来源；核对资源署名和商标许可 |
| dsh-agent-md设计参考 | resource | 首次公开观测建立基准，非已适配证明 | github-file: wwsmiler1-bit/dsh-agent-md / README.md | 记录设计参考来源变化，不自动移植或纳入人格提示 |
| GitHub CLI | development-tool-reference | 首次公开观测建立基准，非已适配证明 | github: cli/cli | 公开发行与开发发布流程兼容；不扫描本机CLI或读取登录凭据 |
| containerd生命周期数据来源 | resource | 首次公开观测建立基准，非已适配证明 | github-file: endoflife-date/endoflife.date / products/containerd.md | 版本筛选新增依赖的社区生命周期元数据本身；支持政策仍需核对官方证据 |
| ffmpeg生命周期数据来源 | resource | 首次公开观测建立基准，非已适配证明 | github-file: endoflife-date/endoflife.date / products/ffmpeg.md | 版本筛选新增依赖的社区生命周期元数据本身；支持政策仍需核对官方证据 |
| ubuntu生命周期数据来源 | resource | 首次公开观测建立基准，非已适配证明 | github-file: endoflife-date/endoflife.date / products/ubuntu.md | 版本筛选新增依赖的社区生命周期元数据本身；支持政策仍需核对官方证据 |
| ca-certificates（安装器声明包） | related-project | 首次公开观测建立基准，非已适配证明 | document: https://packages.ubuntu.com/resolute/ca-certificates | 安装器显式软件包的受支持Ubuntu LTS发行参考；实际可用版本以对应发行源为准，不等同宿主巡检 |
| curl（安装器声明包） | related-project | 首次公开观测建立基准，非已适配证明 | document: https://packages.ubuntu.com/resolute/curl | 安装器显式软件包的受支持Ubuntu LTS发行参考；实际可用版本以对应发行源为准，不等同宿主巡检 |
| xz-utils（安装器声明包） | related-project | 首次公开观测建立基准，非已适配证明 | document: https://packages.ubuntu.com/resolute/xz-utils | 安装器显式软件包的受支持Ubuntu LTS发行参考；实际可用版本以对应发行源为准，不等同宿主巡检 |
| git（安装器声明包） | related-project | 首次公开观测建立基准，非已适配证明 | document: https://packages.ubuntu.com/resolute/git | 安装器显式软件包的受支持Ubuntu LTS发行参考；实际可用版本以对应发行源为准，不等同宿主巡检 |
| ffmpeg（安装器声明包） | related-project | 首次公开观测建立基准，非已适配证明 | document: https://packages.ubuntu.com/resolute/ffmpeg | 安装器显式软件包的受支持Ubuntu LTS发行参考；实际可用版本以对应发行源为准，不等同宿主巡检 |
| build-essential（安装器声明包） | related-project | 首次公开观测建立基准，非已适配证明 | document: https://packages.ubuntu.com/resolute/build-essential | 安装器显式软件包的受支持Ubuntu LTS发行参考；实际可用版本以对应发行源为准，不等同宿主巡检 |
| pkg-config（安装器声明包） | related-project | 首次公开观测建立基准，非已适配证明 | document: https://packages.ubuntu.com/resolute/pkg-config | 安装器显式软件包的受支持Ubuntu LTS发行参考；实际可用版本以对应发行源为准，不等同宿主巡检 |
| python3（安装器声明包） | related-project | 首次公开观测建立基准，非已适配证明 | document: https://packages.ubuntu.com/resolute/python3 | 安装器显式软件包的受支持Ubuntu LTS发行参考；实际可用版本以对应发行源为准，不等同宿主巡检 |
| docker-ce（安装器声明包） | related-project | 首次公开观测建立基准，非已适配证明 | document: https://packages.ubuntu.com/resolute/docker-ce | 安装器显式软件包的受支持Ubuntu LTS发行参考；实际可用版本以对应发行源为准，不等同宿主巡检 |
| docker-ce-cli（安装器声明包） | related-project | 首次公开观测建立基准，非已适配证明 | document: https://packages.ubuntu.com/resolute/docker-ce-cli | 安装器显式软件包的受支持Ubuntu LTS发行参考；实际可用版本以对应发行源为准，不等同宿主巡检 |
| containerd.io（安装器声明包） | related-project | 首次公开观测建立基准，非已适配证明 | document: https://packages.ubuntu.com/resolute/containerd.io | 安装器显式软件包的受支持Ubuntu LTS发行参考；实际可用版本以对应发行源为准，不等同宿主巡检 |
| docker-buildx-plugin（安装器声明包） | related-project | 首次公开观测建立基准，非已适配证明 | document: https://packages.ubuntu.com/resolute/docker-buildx-plugin | 安装器显式软件包的受支持Ubuntu LTS发行参考；实际可用版本以对应发行源为准，不等同宿主巡检 |
| docker-compose-plugin（安装器声明包） | related-project | 首次公开观测建立基准，非已适配证明 | document: https://packages.ubuntu.com/resolute/docker-compose-plugin | 安装器显式软件包的受支持Ubuntu LTS发行参考；实际可用版本以对应发行源为准，不等同宿主巡检 |
| Docker Engine | related-project | 首次公开观测建立基准，非已适配证明 | github: moby/moby | 安装器或官方镜像声明的运行/构建组件，只查公开上游，不检查、安装或升级宿主软件 |
| Docker CLI | related-project | 首次公开观测建立基准，非已适配证明 | github: docker/cli | 安装器或官方镜像声明的运行/构建组件，只查公开上游，不检查、安装或升级宿主软件 |
| Docker Compose | related-project | 首次公开观测建立基准，非已适配证明 | github: docker/compose | 安装器或官方镜像声明的运行/构建组件，只查公开上游，不检查、安装或升级宿主软件 |
| Docker Buildx | related-project | 首次公开观测建立基准，非已适配证明 | github: docker/buildx | 安装器或官方镜像声明的运行/构建组件，只查公开上游，不检查、安装或升级宿主软件 |
| BuildKit | related-project | 首次公开观测建立基准，非已适配证明 | github: moby/buildkit | 安装器或官方镜像声明的运行/构建组件，只查公开上游，不检查、安装或升级宿主软件 |
| containerd LTS | related-project | 首次公开观测建立基准，非已适配证明 | github: containerd/containerd | 安装器或官方镜像声明的运行/构建组件，只查公开上游，不检查、安装或升级宿主软件 |
| runc | related-project | 首次公开观测建立基准，非已适配证明 | github: opencontainers/runc | 安装器或官方镜像声明的运行/构建组件，只查公开上游，不检查、安装或升级宿主软件 |
| systemd | related-project | 首次公开观测建立基准，非已适配证明 | github: systemd/systemd | 安装器或官方镜像声明的运行/构建组件，只查公开上游，不检查、安装或升级宿主软件 |
| XZ Utils | related-project | 首次公开观测建立基准，非已适配证明 | github: tukaani-project/xz | 安装器或官方镜像声明的运行/构建组件，只查公开上游，不检查、安装或升级宿主软件 |
| pkgconf | related-project | 首次公开观测建立基准，非已适配证明 | github: pkgconf/pkgconf | 安装器或官方镜像声明的运行/构建组件，只查公开上游，不检查、安装或升级宿主软件 |
| containerd支持政策 | related-project | 首次公开观测建立基准，非已适配证明 | document: https://api.github.com/repos/containerd/containerd/contents/RELEASES.md | 官方LTS支持周期证据 |
| Ubuntu LTS | related-project | 首次公开观测建立基准，非已适配证明 | lifecycle: ubuntu | 安装器支持系统的上游最新受支持LTS，不扫描或升级服务器 |
| Ubuntu官方发布周期 | related-project | 首次公开观测建立基准，非已适配证明 | document: https://ubuntu.com/about/release-cycle | 核对LTS周期和安装器兼容矩阵 |
| OpenSSH | related-project | 首次公开观测建立基准，非已适配证明 | document: https://www.openssh.com/releasenotes.html | 安装/校验/运维脚本所需工具或发行包的公开参考，不是宿主软件巡检 |
| sudo | related-project | 首次公开观测建立基准，非已适配证明 | document: https://www.sudo.ws/releases/stable/ | 安装/校验/运维脚本所需工具或发行包的公开参考，不是宿主软件巡检 |
| APT | related-project | 首次公开观测建立基准，非已适配证明 | document: https://tracker.debian.org/pkg/apt | 安装/校验/运维脚本所需工具或发行包的公开参考，不是宿主软件巡检 |
| dpkg | related-project | 首次公开观测建立基准，非已适配证明 | document: https://www.dpkg.org/ | 安装/校验/运维脚本所需工具或发行包的公开参考，不是宿主软件巡检 |
| GCC | related-project | 首次公开观测建立基准，非已适配证明 | document: https://gcc.gnu.org/releases.html | 安装/校验/运维脚本所需工具或发行包的公开参考，不是宿主软件巡检 |
| GNU Make | related-project | 首次公开观测建立基准，非已适配证明 | document: https://www.gnu.org/software/make/ | 安装/校验/运维脚本所需工具或发行包的公开参考，不是宿主软件巡检 |
| GNU coreutils | related-project | 首次公开观测建立基准，非已适配证明 | document: https://www.gnu.org/software/coreutils/ | 安装/校验/运维脚本所需工具或发行包的公开参考，不是宿主软件巡检 |
| GNU findutils | related-project | 首次公开观测建立基准，非已适配证明 | document: https://www.gnu.org/software/findutils/ | 安装/校验/运维脚本所需工具或发行包的公开参考，不是宿主软件巡检 |
| GNU grep | related-project | 首次公开观测建立基准，非已适配证明 | document: https://www.gnu.org/software/grep/ | 安装/校验/运维脚本所需工具或发行包的公开参考，不是宿主软件巡检 |
| GNU sed | related-project | 首次公开观测建立基准，非已适配证明 | document: https://www.gnu.org/software/sed/ | 安装/校验/运维脚本所需工具或发行包的公开参考，不是宿主软件巡检 |
| GNU awk | related-project | 首次公开观测建立基准，非已适配证明 | document: https://www.gnu.org/software/gawk/ | 安装/校验/运维脚本所需工具或发行包的公开参考，不是宿主软件巡检 |
| iproute2 | related-project | 首次公开观测建立基准，非已适配证明 | document: https://wiki.linuxfoundation.org/networking/iproute2 | 安装/校验/运维脚本所需工具或发行包的公开参考，不是宿主软件巡检 |
| util-linux | related-project | 首次公开观测建立基准，非已适配证明 | document: https://github.com/util-linux/util-linux/releases | 安装/校验/运维脚本所需工具或发行包的公开参考，不是宿主软件巡检 |
| CA信任根 | related-project | 首次公开观测建立基准，非已适配证明 | document: https://curl.se/docs/caextract.html | 安装/校验/运维脚本所需工具或发行包的公开参考，不是宿主软件巡检 |
| SnowLuma官方镜像 | upstream | 首次公开观测建立基准，非已适配证明 | docker-image: motricseven7/snowluma / latest | 监测官方默认镜像标签内容变化；应用正式版本由SnowLuma项目单独判断，不自动升级或重启；合并管理40项内部记录，详细归属见清单JSON，不逐项检查或提醒 |

## 随上层统一管理的组件

- @types/node：1项。
- playwright：2项。
- typescript：20项。
- DeepSeek Harness：31项。
- Node.js LTS：8项。
- SnowLuma：600项。
- SnowLuma官方镜像：40项。

详细映射保留在DEPENDENCIES.json的managedSources，供维护审查；内部组件不作为独立检查或通知项。更新上层会采用该上层所集成的组件版本，不保证每个组件都恰为其独立最新版。

## 覆盖边界

- 检查单位按可独立更新的上层项目合并；内部模块保留managedSources归属记录，既不逐个联网检查，也不单独提醒。软件发布、镜像发布和独立工具不是同一升级单位。
- 清单覆盖本插件锁/声明/源码/脚本/测试导入、资源和接入；QQ另含官方公开镜像声明、SnowLuma公开锁快照。均不扫描宿主，不把公开快照当实际安装证明。
- 公开资料型服务没有可靠版本API时比较正文摘要，首次只建立基线；页面改版、脚本渲染、缺少历史或访问失败均须人工核实。
- 自定义HTTP、本地命令、第三方模型/工作流/插件和用户后加的工具无法从私有配置推断；请在补充上游中登记公开来源与适配基准。报告不会读取命令或密钥。
- npm稳定版本不等于适配兼容；dsh/SDK预览版也必须做回归。间接依赖优先通过上层包升级。安全公告只覆盖OSV已收录的npm版本。
- 没有公开SBOM的闭源QQ/镜像内部、用户自定义命令/私有模型/后加插件不能凭空枚举；新项目须登记公开来源。公开上游锁与镜像声明变化时须刷新UPSTREAM-SNAPSHOT，覆盖不代表永久不漏项。
- 版本规则：明确LTS优先，无LTS采用正式稳定版；不自动回退预览。dsh/SDK是预览例外。文件/服务文档监测内容变化，不等于软件发版。
- 当前报告记录仓库发布基准，不能代表服务器实际安装；部署状态由接手者获得授权后核对。
- 邮件/微信厂商的账号额度、地域、服务端灰度和不公开变更无法保证自动识别；报告列出来源和未决项，不宣称覆盖上游未公开信息。
