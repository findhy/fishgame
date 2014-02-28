package com.game.fish.startup;

import java.io.File;

//import org.eclipse.jetty.server.Connector;
//import org.eclipse.jetty.server.Server;
import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Handler;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.handler.DefaultHandler;
import org.mortbay.jetty.handler.HandlerCollection;
import org.mortbay.jetty.nio.SelectChannelConnector;
import org.mortbay.jetty.webapp.WebAppContext;

//import org.eclipse.jetty.server.nio.SelectChannelConnector;
//import org.eclipse.jetty.webapp.WebAppContext;

//import com.sino.ddm.base.jetty.JettyFactory;
//import com.sino.ddm.base.spring.Profiles;

/**
 * 使用Jetty运行调试Web应用, 在Console输入回车快速重新加载应用.
 * @author sunwill
 *
 */
public class QuickStartServer {

	public static final int PORT = 9090;
	public static final String CONTEXT = "/fish";
	public static final String[] TLD_JAR_NAMES = new String[] { "spring-webmvc","springside-core" };
	private static final String DEFAULT_WEBAPP_PATH = "../fish/src/main/webapp";
	private static final String WINDOWS_WEBDEFAULT_PATH = "../fish/src/resources/jetty/webdefault-windows.xml";

	
	public static void main(String[] args){
		//设定Spring的profile
		//Profiles.setProfileAsSystemProperty(Profiles.DEVELOPMENT);
		
		// 启动Jetty
		//Server server = JettyFactory.createServerInSource(PORT, CONTEXT);
		
		/*Server server = new Server();
		// 设置在JVM退出时关闭Jetty的钩子。
		server.setStopAtShutdown(true);

		SelectChannelConnector connector = new SelectChannelConnector();
		connector.setPort(PORT);
		// 解决Windows下重复启动Jetty居然不报告端口冲突的问题.
		connector.setReuseAddress(false);
		server.setConnectors(new Connector[] { connector });

		WebAppContext webContext = new WebAppContext(DEFAULT_WEBAPP_PATH, "/ddm");
		// 修改webdefault.xml，解决Windows下Jetty Lock住静态文件的问题.
		webContext.setDefaultsDescriptor(WINDOWS_WEBDEFAULT_PATH);
		server.setHandler(webContext);
		
		JettyFactory.setTldJarNames(server, TLD_JAR_NAMES);*/
		
		
		
		Server server = new Server();
		
    	Connector connector = new SelectChannelConnector();
    	connector.setPort(8080);
    	server.setConnectors(new Connector[]{connector});

        String[] tryPaths = new String[] {
                "fish/src/main/webapp",
                "../fish/src/main/webapp"
        };

        String webapp = System.getProperty("webapp");
        if (webapp == null) {
            for (String tryPath : tryPaths) {
                if (new File(tryPath).exists()) {
                    webapp = tryPath;
                }
            }
        }

        if (webapp == null) {
            return;
        }
    	
    	WebAppContext webappcontext = new WebAppContext();
    	webappcontext.setContextPath("/fish");
    	webappcontext.setWar(webapp);

    	HandlerCollection handlers= new HandlerCollection();
    	handlers.setHandlers(new Handler[]{webappcontext, new DefaultHandler()});

    	server.setHandler(handlers);
    	try {
			server.start();
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		try {
			server.join();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		/*try {
			server.start();

			System.out.println("[INFO] Server running at http://localhost:" + PORT + CONTEXT);
			System.out.println("[HINT] Hit Enter to reload the application quickly");

			// 等待用户输入回车重载应用.
			while (true) {
				char c = (char) System.in.read();
				if (c == '\n') {
					JettyFactory.reloadContext(server);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.exit(-1);
		}*/
	}
}
