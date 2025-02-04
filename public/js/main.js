jQuery(document).ready(function ($) {
  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      1500,
      "easeInOutExpo"
    );
    return false;
  });

  // Stick the header at top on scroll
  $("#header").sticky({
    topSpacing: 0,
    zIndex: "50",
  });

  // Intro background carousel
  $("#intro-carousel").owlCarousel({
    autoplay: true,
    dots: false,
    loop: true,
    animateOut: "fadeOut",
    items: 1,
  });

  // Initiate the wowjs animation library
  new WOW().init();

  // Initiate superfish on nav menu
  $(".nav-menu").superfish({
    animation: {
      opacity: "show",
    },
    speed: 400,
  });

  // Mobile Navigation
  if ($("#nav-menu-container").length) {
    var $mobile_nav = $("#nav-menu-container").clone().prop({
      id: "mobile-nav",
    });
    $mobile_nav.find("> ul").attr({
      class: "",
      id: "",
    });
    $("body").append($mobile_nav);
    $("body").prepend(
      '<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>'
    );
    $("body").append('<div id="mobile-body-overly"></div>');
    $("#mobile-nav")
      .find(".menu-has-children")
      .prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on("click", ".menu-has-children i", function (e) {
      $(this).next().toggleClass("menu-item-active");
      $(this).nextAll("ul").eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on("click", "#mobile-nav-toggle", function (e) {
      $("body").toggleClass("mobile-nav-active");
      $("#mobile-nav-toggle i").toggleClass("fa-times fa-bars");
      $("#mobile-body-overly").toggle();
    });

    $(document).click(function (e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($("body").hasClass("mobile-nav-active")) {
          $("body").removeClass("mobile-nav-active");
          $("#mobile-nav-toggle i").toggleClass("fa-times fa-bars");
          $("#mobile-body-overly").fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Smooth scroll for the menu and links with .scrollto classes
  $(".nav-menu a, #mobile-nav a, .scrollto").on("click", function () {
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($("#header").length) {
          top_space = $("#header").outerHeight();

          if (!$("#header").hasClass("header-fixed")) {
            top_space = top_space - 20;
          }
        }

        $("html, body").animate(
          {
            scrollTop: target.offset().top - top_space,
          },
          1500,
          "easeInOutExpo"
        );

        if ($(this).parents(".nav-menu").length) {
          $(".nav-menu .menu-active").removeClass("menu-active");
          $(this).closest("li").addClass("menu-active");
        }

        if ($("body").hasClass("mobile-nav-active")) {
          $("body").removeClass("mobile-nav-active");
          $("#mobile-nav-toggle i").toggleClass("fa-times fa-bars");
          $("#mobile-body-overly").fadeOut();
        }
        return false;
      }
    }
  });

  // Porfolio - uses the magnific popup jQuery plugin
  $(".portfolio-popup").magnificPopup({
    type: "image",
    removalDelay: 300,
    mainClass: "mfp-fade",
    gallery: {
      enabled: true,
    },
    zoom: {
      enabled: true,
      duration: 300,
      easing: "ease-in-out",
      opener: function (openerElement) {
        return openerElement.is("img")
          ? openerElement
          : openerElement.find("img");
      },
    },
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      900: {
        items: 3,
      },
    },
  });

  // Clients carousel (uses the Owl Carousel library)
  $(".clients-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 2,
      },
      768: {
        items: 4,
      },
      900: {
        items: 6,
      },
    },
  });

  // Xử lý sự kiện đăng nhập
  $("#loginForm").submit(function (e) {
    e.preventDefault();

    const phoneNumber = $("#phoneNumber").val();

    // Gửi yêu cầu đăng nhập
    $.ajax({
      url: "http://localhost:3000/api/login", // Đường dẫn API đăng nhập
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ phoneNumber }), // Sử dụng phoneNumber
      success: function (response) {
        // Hiển thị modal OTP
        $("#otpModal").modal("show");
        $("#responseMessage").text(
          "OTP đã được gửi đến số điện thoại của bạn. Vui lòng kiểm tra!"
        );
      },
      error: function (error) {
        // Hiển thị lỗi nếu đăng nhập thất bại
        $("#responseMessage").text("Số điện thoại không đúng!");
      },
    });
  });

  // Xử lý sự kiện xác minh OTP
  $("#verifyOTPButton").click(function () {
    const phoneNumber = $("#phoneNumber").val(); // Lấy số điện thoại từ form đăng nhập
    const otp = $("#otp").val(); // Lấy mã OTP từ popup

    // Gửi yêu cầu xác minh OTP
    $.ajax({
      url: "http://localhost:3000/api/login/verify", // Đường dẫn API xác minh OTP
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ phoneNumber, otp }), // Sử dụng phoneNumber
      success: function (response) {
        // Lưu token vào localStorage
        localStorage.setItem("authToken", response.token);
        // Điều hướng về trang home
        window.location.href = "home.html";
      },
      error: function (error) {
        // Hiển thị lỗi nếu OTP không hợp lệ
        $("#responseMessage").text("OTP không hợp lệ! Vui lòng thử lại.");
      },
    });
  });

  // Xử lý sự kiện đăng ký
  $("#registerForm").submit(function (e) {
    e.preventDefault();

    const phoneNumber = $("#phoneNumber").val();

    // Gửi yêu cầu đăng ký
    $.ajax({
      url: "http://localhost:3000/api/register", // Đường dẫn API đăng nhập
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ phoneNumber }), // Sử dụng phoneNumber
      success: function (response) {
        // Hiển thị modal OTP
        $("#otpModalRegister").modal("show");
        $("#responseMessageRegister").text(
          "OTP đã được gửi đến số điện thoại của bạn. Vui lòng kiểm tra!"
        );
      },
      error: function (error) {
        // Hiển thị lỗi nếu đăng nhập thất bại
        $("#responseMessageRegister").text("Số điện thoại đã được đăng ký!");
      },
    });
  });

  // Xử lý sự kiện xác minh OTP
  $("#verifyOTPButtonRegister").click(function () {
    const phoneNumber = $("#phoneNumber").val(); // Lấy số điện thoại từ form đăng nhập
    const otp = $("#otp").val(); // Lấy mã OTP từ popup

    // Gửi yêu cầu xác minh OTP
    $.ajax({
      url: "http://localhost:3000/api/register/verify", // Đường dẫn API xác minh OTP
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ phoneNumber, otp }), // Sử dụng phoneNumber
      success: function (response) {
        $("#otpModalRegister").modal("hide");
        $("#responseMessageRegister")
        .removeClass("text-danger")
        .addClass("text-success")
        .text("Xác minh OTP thành công! Bạn đã đăng ký thành công.");
      },
      error: function (error) {
        // Hiển thị lỗi nếu OTP không hợp lệ
        $("#responseMessage").text("OTP không hợp lệ! Vui lòng thử lại.");
      },
    });
  });

  
  
});

$(document).ready(function() {
  // Kiểm tra nếu authToken tồn tại trong localStorage hoặc cookie
  var authToken = localStorage.getItem('authToken');

  if (authToken) {
    
    // Nếu có authToken, thay đổi nút thành Đăng Xuất
    $('#authButton').text('Đăng Xuất');
    $('#authButton').attr('href', '/logout'); // Đường dẫn tới trang đăng xuất

    // Xử lý sự kiện đăng xuất khi nhấn nút
    $('#authButton').click(function(event) {
      event.preventDefault(); // Ngừng chuyển hướng mặc định
      localStorage.removeItem('authToken'); // Xóa authToken khỏi localStorage
      window.location.href = '/'; // Chuyển hướng về trang chủ
    });
  } else {
    // Nếu không có authToken, hiển thị nút Đăng Nhập
    $('#authButton').text('Đăng Nhập');
    $('#authButton').attr('href', '/login');
  }
});