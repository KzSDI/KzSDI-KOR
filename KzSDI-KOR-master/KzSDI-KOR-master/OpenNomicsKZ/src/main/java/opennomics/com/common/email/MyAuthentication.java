package opennomics.com.common.email;

import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;


/**
 * 메일전송을 사용하기위한 권한을 생성한다.
 * @author SG.Lee
 * @Date 2016.06
 * */
public class MyAuthentication extends Authenticator {
	PasswordAuthentication pa;

	
	public MyAuthentication(String id, String password) {
		pa = new PasswordAuthentication(id, password); 
	}

	public PasswordAuthentication getPasswordAuthentication() {
		return pa;
	}
}

