

// ***** Debian 8 서버 *****

// Server Reboot
sudo reboot

// 데몬 실행
// https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-debian-8
sudo pm2 start web.js -- server-ktest

// port 세팅
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000