# viabtc mall admin 

## 依赖
1. vue + nuxt
2. element-ui


## 部署
```
git clone
# 初始化: 
sh ./init.sh

# 部署:
sh ./deploy.sh
```

## 本地开发
npm run local 启动本地服务，调用测试后台的api，需要nginx配置转发
```
server {
        listen       80;
        server_name  local-admin.viabtc.com;

        location /api/admin/ {
            proxy_pass http://admin.mall-dev.viabtc.com/api/admin/;
            proxy_set_header HOST admin.mall-dev.viabtc.com;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        location / {
            proxy_pass http://localhost:5000/;
            proxy_set_header HOST $host;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    
    }
```
也可以转发到本地mock的api服务，将/api/admin/ 指向 localhost:4000启动server/index里面mock部分