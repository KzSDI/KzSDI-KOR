package opennomics.com.common.email;

import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.naming.NamingException;



/**
 * 메일전송 요청을 처리한다.
 * 
 * @author SG.Lee
 * @Date 2016.06
 * */
public class SendEmail {
	
	
	/**
	 * 메일을 보내는 함수이다.
	 * 
	 * @author SG.LEE
	 * @data 2016.06
	 * @param host - smtp 서버명
	 * @param userName - 보내는사람 이메일주소
	 * @param password - 보내는사람 이메일 비밀번호
	 * @param recipient - 받는사람 이메일주소
	 * @param subject - 메일제목
	 * @param content - 메일내용
	 * @return 
	 */
	public void sendEmail(String host, String userName, String password, String recipient, String subject, String content)
			throws MessagingException, NamingException{
		        Properties props = new Properties();
		        props.put("mail.smtps.auth", "true");
		        
		        Authenticator auth = new MyAuthentication(userName,password);
		        
		        // 메일 세션
		        Session session = Session.getInstance(props, auth);
		        MimeMessage msg = new MimeMessage(session);
		 
		        
		        // 메일 관련
		        msg.setSubject(subject);
		        msg.setText(content);
		        msg.setFrom(new InternetAddress(userName));
		        msg.addRecipient(Message.RecipientType.TO, new InternetAddress(recipient));
		 
		        // 발송 처리
		        Transport transport = session.getTransport("smtps");
		        transport.connect(host, userName, password);
		        transport.sendMessage(msg, msg.getAllRecipients());
		        transport.close();
			}
}
