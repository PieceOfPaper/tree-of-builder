

// Server Reboot
sudo reboot

// 데몬 실행 (pm2)
// https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-debian-8

// 데몬 실행 (pm2) - ktest
sudo pm2 start web.js -- server-ktest

// port 세팅
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000

// git에 포함되지 않는 모듈 다시세팅
npm install psl

// Bitnami 터미널 접근
// https://docs.bitnami.com/virtual-machine/faq/get-started/connect-ssh/

// Bitnami 터미널 접근 - ktest
chmod 600 /Users/the_paper/Projects/tree-of-builder-others/amazon-bitnami-ktest.pem
ssh /Users/the_paper/Projects/tree-of-builder-others/amazon-bitnami-ktest.pem@52.79.204.252
ssh -i /Users/the_paper/Projects/tree-of-builder-others/amazon-bitnami-ktest.pem bitnami@52.79.204.252