import numpy as np
import cv2
from random import randint as rn
import urllib.request as urlr
import imageGet as ig
import imutils

class newImage():
    def __init__(self):
        #Initialize a new image
        self.new_image = np.zeros((1,1,3),np.uint8)
        #Set the available options, append the values with the queries given
        self.options = {"-b ":[],"-i ":[],"-o ":[],"-t ":[],"-f ":[]}
        self.errors = []
        
    def set_image_size(self,width,height):
        #Adjust the size of the initial image
        self.new_image = cv2.resize(self.new_image,(width,height))

    def parse_command(self, command):
        #split the command by a newline and append the associated option values
        for line in command.split("\n"):
            if line[:3] in self.options:
                self.options[line[:3]].append(line[3:])
    #Converts a url into a numpy array
    def bytesFromImgURL(self, url):
        print(url)
        user_agent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'
        
        headers={'User-Agent':user_agent,} 
        request=urlr.Request(url, None, headers) #The assembled request
        response = urlr.urlopen(request)
        data = response.read() # The data u need
        imgArr = np.asarray(bytearray(data), dtype=np.uint8)

        return imgArr
    
    def add_background(self, *query):
        #Function to set the background to a random color if the URL is invalid or fails
        def url_error(error):
            self.errors.append("Background error: "+error)
            self.add_background("#URLerror")

        def parse_size(size_query):
            size_query = size_query.strip()
            size_errors = []
            valid_size = False
            print(size_query)
            try:
                if int(size_query) < 11 and int(size_query) > 0:
                    
                    set_w = int(1920 * int(size_query)*.1)
                    set_h = int(1080 * int(size_query)*.1)
                    valid_size = True
                else:
                    set_w = int(1920 *.3)
                    set_h = int(1080 *.3)
                    valid_size = True
                    print("Please assign a size integer value between 1 and 10, defaulting the size to 5")
                    
            except:
                print("Not a valid integer value")

            print(valid_size)
            if not(valid_size):
                try:
                    #Try to evaluate the size query as a tuple i.e. (100,100)
                    set_w, set_h = eval(size_query)
                    valid_size = True
                    if set_w >= 100 and set_w <= 1920:
                        pass
                    else:
                        print("Width is too big or too small")
                        set_w = 100 if set_h <= 100 else 1920
                        
                    if set_h >= 56 and set_h <= 1080:
                        pass
                    else:
                        print("Height is either too big or too small")
                        set_h = 56 if q_h <= 56 else 1080
                    
                except:
                    size_errors.append("Please enter tuple sizes in the form (width, height) where width > 100 and < 1920 and height is > 56 and < 1080")
                    valid_size = False

            print(set_w,set_h)
            self.set_image_size(set_w,set_h) if valid_size else self.set_image_size(576,324)

        #Start Background
        bg_query = self.options["-b "]
        bg_query = bg_query[0] if bg_query != [] else "#NoBG"
        
        size_queried = False
        if not(query) and "-s" in bg_query:
            size_queried = True
            bg_size = bg_query.split("-s")[1]
            bg_query = bg_query.split("-s")[0]
            
        #If the background query is a color
        if bg_query[0] == "#" or query: 
            #Get only the hex value
            hex_value = bg_query[1:7] if not(query) else query[0]

            #If the hex value is not assigned properly, a random color will be applied
            #An error will be displayed, but it will not break the program
            try:
                #Converts a hex value in the form abc123 to an RGB tuple
                rgb = tuple(int(hex_value[i:i+2], 16) for i in (0, 2 ,4))
            except:
                #The hex value was improperly formatted, generate a random color
                if hex_value != "#URLerror":
                    self.errors.append("Background error: Hex value needs to be in the 6 digit format i.e. #abc123")
                rgb = (rn(0,256),rn(0,256),rn(0,256))
            
            #apply the background colors to the main image
            self.new_image[:] = rgb

        elif bg_query[0] == "*":                
            #Check if the URL given is a valid url, url's not starting with http or https will not work
            if "http://" in bg_query[1:9] or "https://" in bg_query[1:9]:
                bg_url = bg_query[1:].split(" ")[0]
                try:
                    img_array = self.bytesFromImgURL(bg_url)
                    self.new_image = cv2.imdecode(img_array, -1)
                except:
                    #Call the background function with an invalid color query, forcing a random background
                    url_error("Invalid image link, assigning background to a random color")
            else:
                #Call the background function with an invalid color query, forcing a random background
                url_error("Image links must begin with http:// or https://, assigning background to a random color")

        else:
            if "http://" in bg_query[0:9] or "https://" in bg_query[0:9]:
                error = "If you want to add a link, start the link with an asterik, i.e. *http://..."
            else:
                error = "Please limit background queries to links and colors"
            url_error(error+", assigning background to a random color")

        #Finally, adjust the background size to the size queried, if no size was queried, default to 500x500
        parse_size(bg_size) if size_queried else self.set_image_size(500,500)

    def add_subjects(self):
        im_queries = self.options['-i ']
        
        for im in im_queries:
            is_url = False
                        
            if ' -p ' in im and ' -s ' in im:
                pos = im.split(' -p ')[1].split(' -s ')[0]
                print(im.split(' -p ')[1].split(' -s '))
                size = im.split(' -p ')[1].split(' -s ')[1]
            elif ' -p ' in im:
                pos = im.split(' -p ')[1]
                size = rn(1,11)
            elif ' -s ' in im:
                size = im.split(' -s ')[1]
                pos = rn(1,9)
            else:
                size = rn(1,11)
                pos = rn(1,9)

            try:
                pos = int(pos) 
            except:
                pos = rn(1,11)
            try:
                size = int(size)
            except:
                size = rn(1,11)

            if im[0] == '*':
                #Check if the URL given is a valid url, url's not starting with http or https will not work
                if "http://" in im[1:9] or "https://" in im[1:9]:
                    im_url = im[1:].split(" ")[0]
                    try:
                        im_array = self.bytesFromImgURL(im_url)
                        img = cv2.imdecode(im_array, -1)
                        is_url = True
                    except:
                        #Call the background function with an invalid color query, forcing a random background
                        im= "food"
                else:
                    #Call the background function with an invalid color query, forcing a random background
                    im= "food"
            
            rand_im_url = ig.getRandImg(im.split('-p ')[0]) if not(is_url) else im_url

            if not(is_url):
                im_array = self.bytesFromImgURL(rand_im_url)
                img = cv2.imdecode(im_array, -1)            
            
            bg = self.new_image
            bg_w, bg_h, _ = self.new_image.shape
            rn_w = int(bg_w/5 / size)
            rn_h = int(bg_h/5 / size)

            
            img = imutils.resize(img,width = rn_w, height = rn_h)
            im_w, im_h, _ = img.shape
            
            positions = {1:(int(bg_w*(1/6))-int(im_w/2),int(bg_h*(1/6))-int(im_h/2)),
                         2:(int(bg_w/2)-int(im_w/2),int(bg_h*(1/6))-int(im_h/2)),
                         3:(int(bg_w*(5/6))-int(im_w/2),int(bg_h*(1/6))-int(im_h/2)),
                         4:(int(bg_w*(1/6))-int(im_w/2),int(bg_h/2)-int(im_h/2)),
                         5:(int(bg_w/2 - im_w/2),int(bg_w/2 - im_h/2)),
                         6:(int(bg_w*(5/6))-int(im_w/2),int(bg_h/2) - int(im_h/2)),
                         7:(int(bg_w*(1/6)) - int(im_w/2),int(bg_h*(5/6)) - int(im_h/2)),
                         8:(int(bg_w/2)-int(im_w/2),int(bg_h*(5/6))-int(im_h/2)),
                         9:(int(bg_w*(5/6))-int(im_w/2),int(bg.shape[1]*(5/6)) - int(im_h/2))}

            x_offset, y_offset = positions[pos]
            cv2.circle(img, (x_offset, y_offset),3,(10,23,23),-1)
            if x_offset < 0:
                x_offset = 1
            if y_offset < 0:
                y_offset = 1

            print(x_offset+im_w,y_offset+im_h)
            if x_offset+im_h > bg_h:
                x_offset = bg_w - im_w -1
                print("yeP2")
            if y_offset+im_w > bg_h:
                y_offset = bg_h - im_h -1
                print("yeP3")
            #Pastes the PNG image onto the BG with transparency
            y1, y2 = y_offset, y_offset + im_w
            x1, x2 = x_offset, x_offset + im_h

            alpha_s = img[:, :, 3] / 255.0
            alpha_l = 1.0 - alpha_s
            for c in range(0, 3):
                bg[y1:y2, x1:x2, c] = (alpha_s * img[:, :, c] +
                alpha_l * bg[y1:y2, x1:x2, c])
            self.new_image = bg

    def create_image(self, command):
        #Parse the command given
        self.parse_command(command)
        #self.set_image_size(100,100)
        self.add_background()
        self.add_subjects()
        #The final image can be retrieved directly using:
        #return self.new_image()
    
        
        
        
